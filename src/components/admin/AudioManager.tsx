
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, Play, Pause, Search, Filter, Eye, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AudioFileData {
  id: string;
  hymnTitleNumber?: string;
  hymnTitle?: string;
  url: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  description?: string;
  status?: string;
  bookId?: number;
  source: 'AudioFile' | 'uploads';
}

const AudioManager = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFileData[]>([]);
  const [audioTypes, setAudioTypes] = useState([]);
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<number | null>(null);
  const [filterSource, setFilterSource] = useState<string>("");
  const [view, setView] = useState<'upload' | 'manager'>('manager');
  const [uploadForm, setUploadForm] = useState({
    hymnTitleNumber: '',
    audioTypeId: 1,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [audioResult, uploadsResult, typesResult, hymnsResult] = await Promise.all([
        supabase.from('AudioFile').select('*').order('createdAt', { ascending: false }),
        supabase.from('uploads').select('*').order('createdAt', { ascending: false }),
        supabase.from('AudioType').select('*'),
        supabase.from('HymnTitle').select('number, titles')
      ]);

      if (audioResult.error) throw audioResult.error;
      if (uploadsResult.error) throw uploadsResult.error;
      if (typesResult.error) throw typesResult.error;
      if (hymnsResult.error) throw hymnsResult.error;

      // Combine both data sources
      const audioFileRecords: AudioFileData[] = (audioResult.data || []).map(file => ({
        id: file.id,
        hymnTitleNumber: file.hymnTitleNumber,
        url: file.url,
        audioTypeId: file.audioTypeId,
        userId: file.userId,
        createdAt: file.createdAt,
        bookId: file.bookId,
        source: 'AudioFile' as const
      }));

      const uploadRecords: AudioFileData[] = (uploadsResult.data || []).map(upload => ({
        id: upload.id,
        hymnTitle: upload.hymnTitle,
        url: upload.url,
        audioTypeId: upload.audioTypeId,
        userId: upload.userId,
        createdAt: upload.createdAt,
        description: upload.description,
        status: upload.status,
        bookId: upload.bookId,
        source: 'uploads' as const
      }));

      const combinedFiles = [...audioFileRecords, ...uploadRecords];
      setAudioFiles(combinedFiles);
      setAudioTypes(typesResult.data || []);
      setHymns(hymnsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = audioFiles.filter(file => {
    const matchesSearch = searchTerm === "" || 
      (file.hymnTitleNumber && file.hymnTitleNumber.includes(searchTerm)) ||
      (file.hymnTitle && file.hymnTitle.includes(searchTerm)) ||
      (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === null || file.audioTypeId === filterType;
    const matchesSource = filterSource === "" || file.source === filterSource;
    
    return matchesSearch && matchesType && matchesSource;
  });

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      // Save audio file record
      const audioFileId = crypto.randomUUID();
      const currentUser = await supabase.auth.getUser();
      
      const { error: insertError } = await supabase
        .from('AudioFile')
        .insert({
          id: audioFileId,
          url: publicUrl,
          hymnTitleNumber: uploadForm.hymnTitleNumber,
          audioTypeId: uploadForm.audioTypeId,
          userId: currentUser.data.user.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Audio file uploaded successfully.",
      });

      setSelectedFile(null);
      setUploadForm({ hymnTitleNumber: '', audioTypeId: 1, description: '' });
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload audio file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (audioFile: AudioFileData) => {
    if (!confirm('Are you sure you want to delete this audio file?')) return;

    try {
      // Extract file path from URL for storage deletion
      if (audioFile.url.includes('audio-files')) {
        const url = new URL(audioFile.url);
        const filePath = url.pathname.split('/').pop();

        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('audio-files')
            .remove([filePath]);

          if (storageError) console.warn('Storage deletion warning:', storageError);
        }
      }

      // Delete from appropriate database table
      const tableName = audioFile.source === 'AudioFile' ? 'AudioFile' : 'uploads';
      const { error: dbError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', audioFile.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Audio file deleted successfully.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete audio file.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (url: string) => {
    // This would require additional storage metadata
    return 'Unknown';
  };

  const getAudioTypeName = (typeId: number) => {
    const type = audioTypes.find(t => t.id === typeId);
    return type ? type.type : 'Unknown';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading audio files...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Audio File Management</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setView('manager')}
              variant={view === 'manager' ? 'default' : 'outline'}
            >
              <Eye className="w-4 h-4 mr-2" />
              File Manager
            </Button>
            <Button
              onClick={() => setView('upload')}
              variant={view === 'upload' ? 'default' : 'outline'}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
        </div>

        {view === 'upload' && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">Upload New Audio File</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="hymnNumber">Hymn Number</Label>
                <select
                  id="hymnNumber"
                  value={uploadForm.hymnTitleNumber}
                  onChange={(e) => setUploadForm({ ...uploadForm, hymnTitleNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select hymn</option>
                  {hymns.map((hymn) => (
                    <option key={hymn.number} value={hymn.number}>
                      #{hymn.number} - {hymn.titles?.[0]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="audioType">Audio Type</Label>
                <select
                  id="audioType"
                  value={uploadForm.audioTypeId}
                  onChange={(e) => setUploadForm({ ...uploadForm, audioTypeId: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {audioTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="file">Audio File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>
            <Button onClick={handleFileUpload} disabled={uploading || !selectedFile}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Card>
        )}

        {view === 'manager' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4 bg-slate-50">
              <h3 className="text-lg font-semibold mb-3">Filters & Search</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="search"
                      placeholder="Search hymn number, title, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="filterType">Audio Type</Label>
                  <select
                    id="filterType"
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    {audioTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="filterSource">Source</Label>
                  <select
                    id="filterSource"
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Sources</option>
                    <option value="AudioFile">AudioFile Table</option>
                    <option value="uploads">Uploads Table</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType(null);
                      setFilterSource("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>

            {/* File List */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Audio Files ({filteredFiles.length} files)
                </h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hymn</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((audioFile) => (
                    <TableRow key={`${audioFile.source}-${audioFile.id}`}>
                      <TableCell>
                        <div className="font-medium">
                          #{audioFile.hymnTitleNumber || audioFile.hymnTitle}
                        </div>
                      </TableCell>
                      <TableCell>{getAudioTypeName(audioFile.audioTypeId)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {audioFile.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          audioFile.source === 'AudioFile' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {audioFile.source}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(audioFile.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <audio controls className="max-w-[200px]">
                            <source src={audioFile.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <Button
                            onClick={() => handleDelete(audioFile)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFiles.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No audio files found matching your criteria.
                </div>
              )}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AudioManager;
