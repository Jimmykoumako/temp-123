import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { hymns } from '@/data/hymns';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  hymnNumber?: string;
  album?: string;
  albumId?: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  trackCount: number;
  tracks?: Track[];
}

interface Artist {
  name: string;
  trackCount: number;
  albums: string[];
}

export const useMusicLibrary = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create mock data from hymns as fallback
  const createMockData = () => {
    console.log('Using mock data for music library');
    
    const mockTracks: Track[] = hymns.map(hymn => ({
      id: hymn.id.toString(),
      title: hymn.title,
      artist: hymn.artist,
      url: hymn.url,
      duration: hymn.duration,
      hymnNumber: hymn.number,
      album: hymn.album,
      albumId: 'mock-album-1'
    }));

    const mockAlbums: Album[] = [
      {
        id: 'mock-album-1',
        title: 'Classic Hymns Collection',
        artist: 'Various Artists',
        trackCount: mockTracks.length,
        tracks: mockTracks
      }
    ];

    const mockArtists: Artist[] = [
      {
        name: 'Various Artists',
        trackCount: mockTracks.length,
        albums: ['Classic Hymns Collection']
      }
    ];

    setTracks(mockTracks);
    setAlbums(mockAlbums);
    setArtists(mockArtists);
    setRecentlyPlayed(mockTracks.slice(0, 5));
    
    toast({
      title: "Using Sample Data",
      description: "Database access unavailable, showing sample music library"
    });
  };

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch library from database...');
      
      // Test basic connectivity first
      const { data: trackData, error: trackError } = await supabase
        .from('Track')
        .select('*')
        .limit(5);

      if (trackError) {
        console.error('Database access error:', trackError);
        throw trackError;
      }

      console.log('Database access successful, found tracks:', trackData?.length || 0);

      const tracksFormatted: Track[] = (trackData || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: 'HBC Hymns',
        url: track.url,
        duration: '3:45',
        hymnNumber: track.hymnTitleNumber,
        album: 'HBC Collection',
        albumId: track.albumId
      }));

      setTracks(tracksFormatted);

      // Fetch albums
      const { data: albumData, error: albumError } = await supabase
        .from('Album')
        .select('*');

      if (albumError) {
        console.warn('Album fetch error:', albumError);
      }

      const albumsFormatted: Album[] = (albumData || []).map(album => ({
        id: album.id,
        title: album.title,
        artist: 'HBC Hymns',
        coverImage: album.coverImage,
        trackCount: 0
      }));

      // Count tracks per album
      const albumsWithCounts = albumsFormatted.map(album => {
        const albumTracks = tracksFormatted.filter(track => track.albumId === album.id);
        return {
          ...album,
          trackCount: albumTracks.length,
          tracks: albumTracks
        };
      });

      setAlbums(albumsWithCounts);

      // Group artists
      const artistMap = new Map<string, Artist>();
      tracksFormatted.forEach(track => {
        if (!artistMap.has(track.artist)) {
          artistMap.set(track.artist, {
            name: track.artist,
            trackCount: 0,
            albums: []
          });
        }
        const artist = artistMap.get(track.artist)!;
        artist.trackCount++;
        if (track.album && !artist.albums.includes(track.album)) {
          artist.albums.push(track.album);
        }
      });

      setArtists(Array.from(artistMap.values()));
      setRecentlyPlayed(tracksFormatted.slice(0, 10));

      toast({
        title: "Library Loaded",
        description: `Found ${tracksFormatted.length} tracks in your library`
      });

    } catch (error) {
      console.error('Error fetching library, falling back to mock data:', error);
      createMockData();
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (track: Track) => {
    try {
      // Mock implementation - in real app, this would update database
      setFavorites(prev => {
        if (prev.find(t => t.id === track.id)) {
          return prev; // Already in favorites
        }
        return [track, ...prev];
      });

      toast({
        title: "Added to Favorites",
        description: `"${track.title}" added to your favorites`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (trackId: string) => {
    try {
      setFavorites(prev => prev.filter(t => t.id !== trackId));
      
      toast({
        title: "Removed from Favorites",
        description: "Track removed from your favorites"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  };

  const addToRecentlyPlayed = (track: Track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return {
    tracks,
    albums,
    artists,
    recentlyPlayed,
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyPlayed,
    refreshLibrary: fetchLibrary
  };
};
