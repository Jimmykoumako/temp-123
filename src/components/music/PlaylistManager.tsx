
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Music, MoreHorizontal, Trash2, Play } from 'lucide-react';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';

interface PlaylistManagerProps {
  onPlayPlaylist: (playlistId: string) => void;
}

const PlaylistManager = ({ onPlayPlaylist }: PlaylistManagerProps) => {
  const { playlists, loading, createPlaylist, deletePlaylist } = usePlaylistManager();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) return;

    const result = await createPlaylist(newPlaylistTitle, newPlaylistDescription);
    if (result) {
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
      setIsCreateOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Playlist Name</label>
                <Input
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="Enter playlist name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Describe your playlist"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreatePlaylist} disabled={!newPlaylistTitle.trim()}>
                  Create Playlist
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="group hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {playlist.coverImage ? (
                    <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Music className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <Button
                  onClick={() => onPlayPlaylist(playlist.id)}
                  size="sm"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{playlist.title}</CardTitle>
              {playlist.description && (
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{playlist.trackCount} songs</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deletePlaylist(playlist.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {playlists.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Music className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Playlists Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first playlist to organize your favorite music.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlaylistManager;
