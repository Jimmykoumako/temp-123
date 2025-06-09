
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  Download, 
  Trash2, 
  File, 
  Image, 
  Music, 
  Video,
  FileText,
  RefreshCw,
  FolderOpen,
  Plus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

const StorageManager = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [newBucketName, setNewBucketName] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showCreateBucket, setShowCreateBucket] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBuckets();
  }, []);

  useEffect(() => {
    if (selectedBucket) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [selectedBucket]);

  const fetchBuckets = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();

      if (error) {
        console.error('Error fetching buckets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch storage buckets",
          variant: "destructive",
        });
        return;
      }

      setBuckets(data || []);
      if (data && data.length > 0 && !selectedBucket) {
        setSelectedBucket(data[0].id);
      }
    } catch (error) {
      console.error('Error in fetchBuckets:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    if (!selectedBucket) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error fetching files:', error);
        toast({
          title: "Error",
          description: "Failed to fetch files from storage",
          variant: "destructive",
        });
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBucket = async () => {
    if (!newBucketName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a bucket name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.storage.createBucket(newBucketName, {
        public: true,
      });

      if (error) {
        console.error('Error creating bucket:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Bucket created successfully",
      });

      setNewBucketName("");
      setShowCreateBucket(false);
      fetchBuckets();
    } catch (error) {
      console.error('Error creating bucket:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedBucket) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDownload = async (fileName: string) => {
    if (!selectedBucket) return;

    try {
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .download(fileName);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: "Download Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during download",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!selectedBucket || !confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "Delete Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during deletion",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType?.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (mimeType?.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (mimeType?.includes('text') || mimeType?.includes('json')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && buckets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading storage buckets...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bucket Selection */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Storage Bucket</label>
              <div className="flex gap-2">
                <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a bucket" />
                  </SelectTrigger>
                  <SelectContent>
                    {buckets.map((bucket) => (
                      <SelectItem key={bucket.id} value={bucket.id}>
                        {bucket.name} {bucket.public ? "(Public)" : "(Private)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showCreateBucket} onOpenChange={setShowCreateBucket}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Bucket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Storage Bucket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Bucket Name</label>
                        <Input
                          value={newBucketName}
                          onChange={(e) => setNewBucketName(e.target.value)}
                          placeholder="Enter bucket name"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowCreateBucket(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createBucket}>
                          Create Bucket
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {selectedBucket && (
            <>
              {/* File Upload */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                </div>
                <Button
                  onClick={fetchFiles}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading file...
                </div>
              )}

              {/* Files Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                          Loading files...
                        </TableCell>
                      </TableRow>
                    ) : files.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No files found in this bucket. Upload your first file to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.metadata?.mimetype || '')}
                              <span className="font-medium">{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatFileSize(file.metadata?.size || 0)}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {file.metadata?.mimetype || 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatDate(file.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button
                                onClick={() => handleDownload(file.name)}
                                variant="ghost"
                                size="sm"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(file.name)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Bucket: <span className="font-medium">{selectedBucket}</span> • 
                Total files: {files.length}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageManager;
