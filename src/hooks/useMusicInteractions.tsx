
import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  hymnNumber?: string;
  album?: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  trackCount: number;
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

  const toggleLikeTrack = async (track: Track) => {
    setLoading(true);
    try {
      setLikedTracks(prev => {
        const isLiked = prev.some(t => t.id === track.id);
        if (isLiked) {
          return prev.filter(t => t.id !== track.id);
        } else {
          return [...prev, track];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeAlbum = async (album: Album) => {
    setLoading(true);
    try {
      setLikedAlbums(prev => {
        const isLiked = prev.some(a => a.id === album.id);
        if (isLiked) {
          return prev.filter(a => a.id !== album.id);
        } else {
          return [...prev, album];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLikePlaylist = async (playlist: Playlist) => {
    setLoading(true);
    try {
      setLikedPlaylists(prev => {
        const isLiked = prev.some(p => p.id === playlist.id);
        if (isLiked) {
          return prev.filter(p => p.id !== playlist.id);
        } else {
          return [...prev, playlist];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFollowUser = async (userId: string) => {
    setLoading(true);
    try {
      setFollowing(prev => {
        const isFollowing = prev.includes(userId);
        if (isFollowing) {
          return prev.filter(id => id !== userId);
        } else {
          return [...prev, userId];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const isTrackLiked = (trackId: string) => {
    return likedTracks.some(track => track.id === trackId);
  };

  const isAlbumLiked = (albumId: string) => {
    return likedAlbums.some(album => album.id === albumId);
  };

  const isPlaylistLiked = (playlistId: string) => {
    return likedPlaylists.some(playlist => playlist.id === playlistId);
  };

  const isFollowing = (userId: string) => {
    return following.includes(userId);
  };

  const refetch = async () => {
    // Mock refetch - in real app this would reload from API
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return {
    likedTracks,
    likedAlbums,
    likedPlaylists,
    following,
    loading,
    toggleLikeTrack,
    toggleLikeAlbum,
    toggleLikePlaylist,
    toggleFollowUser,
    isTrackLiked,
    isAlbumLiked,
    isPlaylistLiked,
    isFollowing,
    refetch
  };
};
