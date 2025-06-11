
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  album?: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
}

interface Playlist {
  id: string;
  title: string;
  description?: string;
  userId: string;
}

export const useMusicInteractions = () => {
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [likedAlbums, setLikedAlbums] = useState<Album[]>([]);
  const [likedPlaylists, setLikedPlaylists] = useState<Playlist[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentUserId = 'user-' + Math.random().toString(36).substr(2, 9); // Mock user ID

  const fetchLikedContent = async () => {
    setLoading(true);
    try {
      // Fetch liked tracks
      const { data: likedTrackIds } = await supabase
        .from('_LikedTracks')
        .select('B')
        .eq('A', currentUserId);

      if (likedTrackIds && likedTrackIds.length > 0) {
        const trackIds = likedTrackIds.map(item => item.B);
        const { data: tracksData } = await supabase
          .from('Track')
          .select('*')
          .in('id', trackIds);

        const formattedTracks: Track[] = (tracksData || []).map(track => ({
          id: track.id,
          title: track.title,
          artist: 'HBC Hymns',
          url: track.url,
          duration: '3:45',
          album: 'HBC Collection'
        }));

        setLikedTracks(formattedTracks);
      }

      // Fetch liked albums
      const { data: likedAlbumIds } = await supabase
        .from('_LikedAlbums')
        .select('B')
        .eq('A', currentUserId);

      if (likedAlbumIds && likedAlbumIds.length > 0) {
        const albumIds = likedAlbumIds.map(item => item.B);
        const { data: albumsData } = await supabase
          .from('Album')
          .select('*')
          .in('id', albumIds);

        const formattedAlbums: Album[] = (albumsData || []).map(album => ({
          id: album.id,
          title: album.title,
          artist: 'HBC Hymns',
          coverImage: album.coverImage
        }));

        setLikedAlbums(formattedAlbums);
      }

      // Fetch liked playlists
      const { data: likedPlaylistIds } = await supabase
        .from('_LikedPlaylists')
        .select('B')
        .eq('A', currentUserId);

      if (likedPlaylistIds && likedPlaylistIds.length > 0) {
        const playlistIds = likedPlaylistIds.map(item => item.B);
        const { data: playlistsData } = await supabase
          .from('Playlist')
          .select('*')
          .in('id', playlistIds);

        setLikedPlaylists(playlistsData || []);
      }

      // Fetch following
      const { data: followingData } = await supabase
        .from('Follow')
        .select('followingId')
        .eq('followerId', currentUserId);

      setFollowing((followingData || []).map(item => item.followingId));

    } catch (error) {
      console.error('Error fetching liked content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your liked content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeTrack = async (track: Track) => {
    try {
      const isLiked = likedTracks.some(t => t.id === track.id);

      if (isLiked) {
        // Unlike track
        const { error } = await supabase
          .from('_LikedTracks')
          .delete()
          .eq('A', currentUserId)
          .eq('B', track.id);

        if (error) throw error;

        setLikedTracks(prev => prev.filter(t => t.id !== track.id));
        toast({
          title: "Removed from Liked Songs",
          description: `"${track.title}" removed from your liked songs`
        });
      } else {
        // Like track
        const { error } = await supabase
          .from('_LikedTracks')
          .insert({
            A: currentUserId,
            B: track.id
          });

        if (error) throw error;

        setLikedTracks(prev => [track, ...prev]);
        toast({
          title: "Added to Liked Songs",
          description: `"${track.title}" added to your liked songs`
        });
      }
    } catch (error) {
      console.error('Error toggling track like:', error);
      toast({
        title: "Error",
        description: "Failed to update liked songs",
        variant: "destructive"
      });
    }
  };

  const toggleLikeAlbum = async (album: Album) => {
    try {
      const isLiked = likedAlbums.some(a => a.id === album.id);

      if (isLiked) {
        // Unlike album
        const { error } = await supabase
          .from('_LikedAlbums')
          .delete()
          .eq('A', currentUserId)
          .eq('B', album.id);

        if (error) throw error;

        setLikedAlbums(prev => prev.filter(a => a.id !== album.id));
        toast({
          title: "Removed from Liked Albums",
          description: `"${album.title}" removed from your liked albums`
        });
      } else {
        // Like album
        const { error } = await supabase
          .from('_LikedAlbums')
          .insert({
            A: currentUserId,
            B: album.id
          });

        if (error) throw error;

        setLikedAlbums(prev => [album, ...prev]);
        toast({
          title: "Added to Liked Albums",
          description: `"${album.title}" added to your liked albums`
        });
      }
    } catch (error) {
      console.error('Error toggling album like:', error);
      toast({
        title: "Error",
        description: "Failed to update liked albums",
        variant: "destructive"
      });
    }
  };

  const toggleLikePlaylist = async (playlist: Playlist) => {
    try {
      const isLiked = likedPlaylists.some(p => p.id === playlist.id);

      if (isLiked) {
        // Unlike playlist
        const { error } = await supabase
          .from('_LikedPlaylists')
          .delete()
          .eq('A', currentUserId)
          .eq('B', playlist.id);

        if (error) throw error;

        setLikedPlaylists(prev => prev.filter(p => p.id !== playlist.id));
        toast({
          title: "Removed from Liked Playlists",
          description: `"${playlist.title}" removed from your liked playlists`
        });
      } else {
        // Like playlist
        const { error } = await supabase
          .from('_LikedPlaylists')
          .insert({
            A: currentUserId,
            B: playlist.id
          });

        if (error) throw error;

        setLikedPlaylists(prev => [playlist, ...prev]);
        toast({
          title: "Added to Liked Playlists",
          description: `"${playlist.title}" added to your liked playlists`
        });
      }
    } catch (error) {
      console.error('Error toggling playlist like:', error);
      toast({
        title: "Error",
        description: "Failed to update liked playlists",
        variant: "destructive"
      });
    }
  };

  const toggleFollow = async (userId: string, userName: string) => {
    try {
      const isFollowing = following.includes(userId);

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('Follow')
          .delete()
          .eq('followerId', currentUserId)
          .eq('followingId', userId);

        if (error) throw error;

        setFollowing(prev => prev.filter(id => id !== userId));
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${userName}`
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('Follow')
          .insert({
            followerId: currentUserId,
            followingId: userId
          });

        if (error) throw error;

        setFollowing(prev => [...prev, userId]);
        toast({
          title: "Following",
          description: `You are now following ${userName}`
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  const isTrackLiked = (trackId: string) => {
    return likedTracks.some(t => t.id === trackId);
  };

  const isAlbumLiked = (albumId: string) => {
    return likedAlbums.some(a => a.id === albumId);
  };

  const isPlaylistLiked = (playlistId: string) => {
    return likedPlaylists.some(p => p.id === playlistId);
  };

  const isFollowing = (userId: string) => {
    return following.includes(userId);
  };

  useEffect(() => {
    fetchLikedContent();
  }, []);

  return {
    likedTracks,
    likedAlbums,
    likedPlaylists,
    following,
    loading,
    toggleLikeTrack,
    toggleLikeAlbum,
    toggleLikePlaylist,
    toggleFollow,
    isTrackLiked,
    isAlbumLiked,
    isPlaylistLiked,
    isFollowing,
    refetch: fetchLikedContent
  };
};
