
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, BarChart3, Users, Music, Volume2 } from "lucide-react";

interface HymnbookStats {
  total_hymns: number;
  hymns_with_lyrics: number;
  hymns_with_audio: number;
  total_audio_files: number;
}

const HymnbookManager = () => {
  const [hymnbooks, setHymnbooks] = useState([]);
  const [stats, setStats] = useState<Record<number, HymnbookStats>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    access_level: 'PRIVATE' as 'PRIVATE' | 'PUBLIC'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnbooks();
  }, []);

  const fetchHymnbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('HymnBook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHymnbooks(data || []);
      
      // Fetch stats for each hymnbook
      await fetchHymnbookStats(data || []);
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

  const fetchHymnbookStats = async (hymnbooks: any[]) => {
    const statsData: Record<number, HymnbookStats> = {};
    
    for (const book of hymnbooks) {
      try {
        const { data, error } = await supabase.rpc('get_hymnbook_stats', {
          book_id: book.id
        });
        
        if (error) throw error;
        if (data && data.length > 0) {
          statsData[book.id] = data[0];
        }
      } catch (error) {
        console.error(`Error fetching stats for book ${book.id}:`, error);
      }
    }
    
    setStats(statsData);
  };

  const handleSave = async () => {
    try {
      const hymnbookData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        access_level: formData.access_level
      };

      if (editingId) {
        const { error } = await supabase
          .from('HymnBook')
          .update(hymnbookData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymnbook updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('HymnBook')
          .insert(hymnbookData);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymnbook created successfully.",
        });
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({ name: '', description: '', category: '', access_level: 'PRIVATE' });
      fetchHymnbooks();
    } catch (error) {
      console.error('Error saving hymnbook:', error);
      toast({
        title: "Error",
        description: "Failed to save hymnbook.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hymnbook) => {
    setEditingId(hymnbook.id);
    setFormData({
      name: hymnbook.name,
      description: hymnbook.description,
      category: hymnbook.category,
      access_level: hymnbook.access_level
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hymnbook? This will also delete all associated hymns and lyrics.')) return;

    try {
      const { error } = await supabase
        .from('HymnBook')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Hymnbook deleted successfully.",
      });
      
      fetchHymnbooks();
    } catch (error) {
      console.error('Error deleting hymnbook:', error);
      toast({
        title: "Error",
        description: "Failed to delete hymnbook.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', category: '', access_level: 'PRIVATE' });
  };

  const toggleActiveStatus = async (hymnbook) => {
    try {
      const { error } = await supabase
        .from('HymnBook')
        .update({ is_active: !hymnbook.is_active })
        .eq('id', hymnbook.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Hymnbook ${hymnbook.is_active ? 'deactivated' : 'activated'} successfully.`,
      });
      
      fetchHymnbooks();
    } catch (error) {
      console.error('Error updating hymnbook status:', error);
      toast({
        title: "Error",
        description: "Failed to update hymnbook status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymnbooks...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Hymnbook Management</h2>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hymnbook
          </Button>
        </div>

        {(showAddForm || editingId) && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Hymnbook' : 'Add New Hymnbook'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Hymnbook name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Traditional, Contemporary"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hymnbook description"
                />
              </div>
              <div>
                <Label htmlFor="access_level">Access Level</Label>
                <select
                  id="access_level"
                  value={formData.access_level}
                  onChange={(e) => setFormData({ ...formData, access_level: e.target.value as 'PRIVATE' | 'PUBLIC' })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
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

        <div className="space-y-4">
          {hymnbooks.map((hymnbook) => {
            const bookStats = stats[hymnbook.id];
            return (
              <Card key={hymnbook.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{hymnbook.name}</h3>
                      <Badge variant={hymnbook.is_active ? "default" : "secondary"}>
                        {hymnbook.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={hymnbook.access_level === 'PUBLIC' ? "outline" : "secondary"}>
                        {hymnbook.access_level}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{hymnbook.description}</p>
                    
                    {/* Statistics */}
                    {bookStats && (
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Music className="w-4 h-4 text-blue-600" />
                          <span>{bookStats.total_hymns} Hymns</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="w-4 h-4 text-green-600" />
                          <span>{bookStats.hymns_with_lyrics} With Lyrics</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Volume2 className="w-4 h-4 text-purple-600" />
                          <span>{bookStats.hymns_with_audio} With Audio</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-orange-600" />
                          <span>{bookStats.total_audio_files} Audio Files</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>Category: {hymnbook.category}</span>
                      <span>Version: {hymnbook.version}</span>
                      <span>Created: {new Date(hymnbook.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleActiveStatus(hymnbook)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      {hymnbook.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(hymnbook)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(hymnbook.id)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HymnbookManager;
