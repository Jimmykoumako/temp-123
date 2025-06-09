import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Save, X, Search, Eye, Music } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import HymnLyricsEditor from "./hymn-editor/HymnLyricsEditor";

const HymnManager = () => {
  const [hymns, setHymns] = useState([]);
  const [hymnbooks, setHymnbooks] = useState([]);
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLyricsViewer, setShowLyricsViewer] = useState(false);
  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const [selectedHymnForEdit, setSelectedHymnForEdit] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    titles: [''],
    bookId: '1'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedHymnbook) {
      fetchHymns();
    }
  }, [selectedHymnbook]);

  const fetchData = async () => {
    try {
      const hymnbooksResult = await supabase.from('HymnBook').select('id, name, description');

      if (hymnbooksResult.error) throw hymnbooksResult.error;

      setHymnbooks(hymnbooksResult.data || []);
      
      // Set the first hymnbook as default if available
      if (hymnbooksResult.data && hymnbooksResult.data.length > 0) {
        setSelectedHymnbook(hymnbooksResult.data[0]);
      }
    } catch (error) {
      console.error('Error fetching hymnbooks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hymnbooks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHymns = async () => {
    if (!selectedHymnbook) return;

    try {
      const { data, error } = await supabase
        .from('HymnTitle')
        .select('*')
        .eq('bookId', selectedHymnbook.id)
        .order('number');

      if (error) throw error;

      setHymns(data || []);
    } catch (error) {
      console.error('Error fetching hymns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hymns.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const hymnData = {
        number: formData.number,
        titles: formData.titles.filter(title => title.trim()),
        bookId: parseInt(formData.bookId)
      };

      if (editingId) {
        const { error } = await supabase
          .from('HymnTitle')
          .update(hymnData)
          .eq('number', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('HymnTitle')
          .insert([hymnData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn created successfully.",
        });
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({ number: '', titles: [''], bookId: selectedHymnbook?.id?.toString() || '1' });
      fetchHymns();
    } catch (error) {
      console.error('Error saving hymn:', error);
      toast({
        title: "Error",
        description: "Failed to save hymn.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hymn) => {
    setEditingId(hymn.number);
    setFormData({
      number: hymn.number,
      titles: hymn.titles || [''],
      bookId: hymn.bookId.toString()
    });
    setShowAddForm(false);
  };

  const handleDelete = async (number) => {
    if (!confirm('Are you sure you want to delete this hymn?')) return;

    try {
      const { error } = await supabase
        .from('HymnTitle')
        .delete()
        .eq('number', number);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Hymn deleted successfully.",
      });
      
      fetchHymns();
    } catch (error) {
      console.error('Error deleting hymn:', error);
      toast({
        title: "Error",
        description: "Failed to delete hymn.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ number: '', titles: [''], bookId: selectedHymnbook?.id?.toString() || '1' });
  };

  const addTitleField = () => {
    setFormData({ ...formData, titles: [...formData.titles, ''] });
  };

  const updateTitle = (index, value) => {
    const newTitles = [...formData.titles];
    newTitles[index] = value;
    setFormData({ ...formData, titles: newTitles });
  };

  const removeTitle = (index) => {
    if (formData.titles.length > 1) {
      const newTitles = formData.titles.filter((_, i) => i !== index);
      setFormData({ ...formData, titles: newTitles });
    }
  };

  const handleEditLyrics = async (hymn) => {
    try {
      // Fetch existing lyrics for this hymn
      const { data: lyricsData, error } = await supabase
        .from('HymnLyric')
        .select('*')
        .eq('hymnTitleNumber', hymn.number)
        .eq('bookId', hymn.bookId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setSelectedHymnForEdit(lyricsData || {
        hymnTitleNumber: hymn.number,
        lyrics: { order: [], verses: [], choruses: [] },
        bookId: hymn.bookId
      });
      setShowLyricsEditor(true);
    } catch (error) {
      console.error('Error fetching hymn lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to load hymn lyrics for editing.",
        variant: "destructive",
      });
    }
  };

  const filteredHymns = hymns.filter(hymn =>
    hymn.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hymn.titles && hymn.titles.some(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (showLyricsEditor) {
    return (
      <HymnLyricsEditor 
        hymn={selectedHymnForEdit}
        onBack={() => {
          setShowLyricsEditor(false);
          setSelectedHymnForEdit(null);
        }}
        onSave={() => {
          setShowLyricsEditor(false);
          setSelectedHymnForEdit(null);
          // Refresh data if needed
        }}
        selectedHymnbook={selectedHymnbook}
      />
    );
  }

  if (showLyricsViewer) {
    return (
      <HymnLyricsViewer 
        onBack={() => setShowLyricsViewer(false)} 
        selectedHymnbook={selectedHymnbook}
      />
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymns...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Hymn Management</h2>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowLyricsViewer(true)}
              variant="outline"
              disabled={!selectedHymnbook}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Lyrics
            </Button>
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hymn
            </Button>
          </div>
        </div>

        {/* Hymnbook Filter */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="hymnbook-select">Select Hymnbook</Label>
            <Select
              value={selectedHymnbook?.id?.toString() || ""}
              onValueChange={(value) => {
                const book = hymnbooks.find(b => b.id.toString() === value);
                setSelectedHymnbook(book);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hymnbook" />
              </SelectTrigger>
              <SelectContent>
                {hymnbooks.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Search */}
          <div>
            <Label htmlFor="search">Search Hymns</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="search"
                type="text"
                placeholder="Search by number or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Hymn' : 'Add New Hymn'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="number">Hymn Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., 001, 002"
                />
              </div>
              <div>
                <Label htmlFor="bookId">Hymnbook</Label>
                <Select
                  value={formData.bookId}
                  onValueChange={(value) => setFormData({ ...formData, bookId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hymnbooks.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Titles</Label>
              {formData.titles.map((title, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                    placeholder="Hymn title"
                  />
                  {formData.titles.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTitle(index)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addTitleField}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Title
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {selectedHymnbook && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">{selectedHymnbook.name}</h3>
            <p className="text-blue-600 text-sm">{selectedHymnbook.description}</p>
            <p className="text-sm text-blue-500 mt-1">
              Showing {filteredHymns.length} of {hymns.length} hymns
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredHymns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {selectedHymnbook ? 'No hymns found for the selected hymnbook' : 'Please select a hymnbook to view hymns'}
            </div>
          ) : (
            filteredHymns.map((hymn) => (
              <Card key={hymn.number} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">#{hymn.number}</h3>
                    <div className="text-slate-600">
                      {hymn.titles && hymn.titles.map((title, index) => (
                        <div key={index}>{title}</div>
                      ))}
                    </div>
                    <div className="text-sm text-slate-500 mt-2">
                      Book: {selectedHymnbook?.name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditLyrics(hymn)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Music className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleEdit(hymn)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(hymn.number)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default HymnManager;
