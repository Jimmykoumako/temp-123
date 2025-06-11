
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Heart, MoreHorizontal, Search, Library, Disc, User, Clock, Star } from 'lucide-react';
import LibraryBrowser from '@/components/music/LibraryBrowser';
import PlaylistManager from '@/components/music/PlaylistManager';
import AdvancedSearchBar from '@/components/music/AdvancedSearchBar';
import SearchResults from '@/components/music/SearchResults';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  hymnNumber?: string;
  album?: string;
  albumId?: string;
}

const AudioBrowser = () => {
  const { 
    tracks, 
    albums, 
    artists, 
    recentlyPlayed, 
    favorites, 
    loading,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyPlayed 
  } = useMusicLibrary();

  const {
    query,
    setQuery,
    filters,
    setFilters,
    searchResults,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    suggestions
  } = useAdvancedSearch(tracks, albums, artists);

  const [currentTab, setCurrentTab] = useState('browse');

  const handlePlayTrack = (track: LibraryTrack) => {
    console.log('Playing track:', track);
    addToRecentlyPlayed(track);
  };

  const handlePlayPlaylist = (playlistId: string) => {
    console.log('Playing playlist:', playlistId);
  };

  const handleSearch = (searchQuery: string) => {
    addToSearchHistory(searchQuery);
  };

  const isInFavorites = (trackId: string) => {
    return favorites.some(track => track.id === trackId);
  };

  const handleToggleFavorite = (track: LibraryTrack) => {
    if (isInFavorites(track.id)) {
      removeFromFavorites(track.id);
    } else {
      addToFavorites(track);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Music Library</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            {favorites.length} Favorites
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            {recentlyPlayed.length} Recent
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <Disc className="h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <LibraryBrowser
            tracks={tracks}
            albums={albums}
            artists={artists}
            recentlyPlayed={recentlyPlayed}
            favorites={favorites}
            onPlayTrack={handlePlayTrack}
            onToggleFavorite={handleToggleFavorite}
            isInFavorites={isInFavorites}
          />
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <AdvancedSearchBar
            query={query}
            onQueryChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            suggestions={suggestions}
            searchHistory={searchHistory}
            onClearHistory={clearSearchHistory}
            onSearch={handleSearch}
          />
          
          {query && (
            <SearchResults
              results={searchResults}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              isInFavorites={isInFavorites}
            />
          )}
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <PlaylistManager onPlayPlaylist={handlePlayPlaylist} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
                <Library className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tracks.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available songs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Albums</CardTitle>
                <Disc className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{albums.length}</div>
                <p className="text-xs text-muted-foreground">
                  Music collections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Artists</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artists.length}</div>
                <p className="text-xs text-muted-foreground">
                  Unique performers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favorites.length}</div>
                <p className="text-xs text-muted-foreground">
                  Liked tracks
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recently Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentlyPlayed.slice(0, 5).map((track) => (
                  <div key={track.id} className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {track.duration}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(track)}
                    >
                      <Heart className={`h-4 w-4 ${isInFavorites(track.id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudioBrowser;
