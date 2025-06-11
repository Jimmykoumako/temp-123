
import { useState, useMemo } from 'react';

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

interface Artist {
  name: string;
  trackCount: number;
  albums: string[];
}

interface SearchFilters {
  type: 'all' | 'tracks' | 'albums' | 'artists';
  genre?: string;
  duration?: 'short' | 'medium' | 'long';
  recent?: boolean;
}

export const useAdvancedSearch = (
  tracks: Track[] = [],
  albums: Album[] = [],
  artists: Artist[] = []
) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        tracks: [],
        albums: [],
        artists: [],
        total: 0
      };
    }

    const lowerQuery = query.toLowerCase();

    let filteredTracks = tracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.hymnNumber?.includes(query) ||
      track.album?.toLowerCase().includes(lowerQuery)
    );

    let filteredAlbums = albums.filter(album =>
      album.title.toLowerCase().includes(lowerQuery) ||
      album.artist.toLowerCase().includes(lowerQuery)
    );

    let filteredArtists = artists.filter(artist =>
      artist.name.toLowerCase().includes(lowerQuery)
    );

    // Apply type filter
    if (filters.type === 'tracks') {
      filteredAlbums = [];
      filteredArtists = [];
    } else if (filters.type === 'albums') {
      filteredTracks = [];
      filteredArtists = [];
    } else if (filters.type === 'artists') {
      filteredTracks = [];
      filteredAlbums = [];
    }

    return {
      tracks: filteredTracks,
      albums: filteredAlbums,
      artists: filteredArtists,
      total: filteredTracks.length + filteredAlbums.length + filteredArtists.length
    };
  }, [query, filters, tracks, albums, artists]);

  const searchMusic = async (searchQuery: string) => {
    setIsSearching(true);
    setQuery(searchQuery);
    addToSearchHistory(searchQuery);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearching(false);
  };

  const addToSearchHistory = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchHistory(prev => {
        const filtered = prev.filter(q => q !== searchQuery);
        return [searchQuery, ...filtered].slice(0, 10);
      });
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const getSuggestions = () => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    // Add track suggestions
    tracks.forEach(track => {
      if (track.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(track.title);
      }
      if (track.artist.toLowerCase().includes(lowerQuery)) {
        suggestions.add(track.artist);
      }
    });

    // Add album suggestions
    albums.forEach(album => {
      if (album.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(album.title);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  };

  return {
    query,
    setQuery,
    filters,
    setFilters,
    searchResults,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    suggestions: getSuggestions(),
    isSearching,
    searchMusic,
    clearSearch
  };
};
