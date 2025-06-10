
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  hymnNumber?: string;
  album?: string;
}

interface Playlist {
  id: string;
  title: string;
  description?: string;
  userId: string;
  tracks?: Track[];
  coverImage?: string;
  createdAt: string;
  trackCount: number;
}

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const { data: playlistData, error } = await supabase
        .from('Playlist')
        .select(`
          id,
          title,
          description,
          userId,
          _PlaylistTracks(
            B
          )
        `);

      if (error) throw error;

      const playlistsWithTracks = await Promise.all(
        (playlistData || []).map(async (playlist) => {
          const trackIds = playlist._PlaylistTracks?.map((pt: any) => pt.B) || [];
          
          if (trackIds.length > 0) {
            const { data: tracks } = await supabase
              .from('Track')
              .select('*')
              .in('id', trackIds);
            
            return {
              ...playlist,
              tracks: tracks || [],
              trackCount: tracks?.length || 0
            };
          }
          
          return {
            ...playlist,
            tracks: [],
            trackCount: 0
          };
        })
      );

      setPlaylists(playlistsWithTracks);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch playlists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (title: string, description?: string) => {
    try {
      const userId = 'user-' + Math.random().toString(36).substr(2, 9);
      
      const { data, error } = await supabase
        .from('Playlist')
        .insert({
          id: 'playlist-' + Math.random().toString(36).substr(2, 9),
          title,
          description,
          userId
        })
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = {
        ...data,
        tracks: [],
        trackCount: 0
      };

      setPlaylists(prev => [newPlaylist, ...prev]);
      
      toast({
        title: "Success",
        description: `Playlist "${title}" created successfully`
      });

      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    try {
      // First remove all tracks from playlist
      const { error: trackError } = await supabase
        .from('_PlaylistTracks')
        .delete()
        .eq('A', playlistId);

      if (trackError) throw trackError;

      // Then delete the playlist
      const { error } = await supabase
        .from('Playlist')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      
      toast({
        title: "Success",
        description: "Playlist deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive"
      });
    }
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const { error } = await supabase
        .from('_PlaylistTracks')
        .insert({
          A: playlistId,
          B: trackId
        });

      if (error) throw error;

      // Refresh playlists to update track count
      await fetchPlaylists();
      
      toast({
        title: "Success",
        description: "Track added to playlist"
      });
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      toast({
        title: "Error",
        description: "Failed to add track to playlist",
        variant: "destructive"
      });
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const { error } = await supabase
        .from('_PlaylistTracks')
        .delete()
        .eq('A', playlistId)
        .eq('B', trackId);

      if (error) throw error;

      // Refresh playlists to update track count
      await fetchPlaylists();
      
      toast({
        title: "Success",
        description: "Track removed from playlist"
      });
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove track from playlist",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return {
    playlists,
    loading,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    refreshPlaylists: fetchPlaylists
  };
};
