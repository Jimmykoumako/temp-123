
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database } from 'lucide-react';
import LibraryBrowser from '@/components/music/LibraryBrowser';
import SearchResults from '@/components/music/SearchResults';
import PlaylistManager from '@/components/music/PlaylistManager';
import SocialMusicFeed from '@/components/music/SocialMusicFeed';
import AdvancedSearchBar from '@/components/music/AdvancedSearchBar';
import DebugDatabaseTest from '@/components/DebugDatabaseTest';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { useMusicInteractions } from '@/hooks/useMusicInteractions';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

const AudioBrowser = () => {
  const [currentTrack, setCurrentTrack] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Hooks for music functionality
  const {
    tracks,
    albums,
    artists,
    recentlyPlayed,
    favorites,
    loading: libraryLoading,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyPlayed,
    refreshLibrary
  } = useMusicLibrary();

  const {
    playlists,
    loading: playlistLoading,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
  } = usePlaylistManager();

  const {
    followUser,
    unfollowUser,
    likeTrack,
    unlikeTrack,
    likeAlbum,
    unlikeAlbum,
    likePlaylist,
    unlikePlaylist,
    isFollowing,
    isTrackLiked,
    isAlbumLiked,
    isPlaylistLiked,
    following,
    followers
  } = useMusicInteractions();

  const {
    searchResults,
    isSearching,
    searchMusic,
    clearSearch
  } = useAdvancedSearch();

  const handlePlayTrack = (track: any) => {
    console.log('Playing track:', track);
    setCurrentTrack(track.id);
    setIsPlaying(true);
    addToRecentlyPlayed(track);
  };

  const handleToggleFavorite = (track: any) => {
    if (isInFavorites(track.id)) {
      removeFromFavorites(track.id);
    } else {
      addToFavorites(track);
    }
  };

  const isInFavorites = (trackId: string) => {
    return favorites.some(track => track.id === trackId);
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.tracks && playlist.tracks.length > 0) {
      handlePlayTrack(playlist.tracks[0]);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={goBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Music Library</h1>
          </div>
          
          <Button
            onClick={() => setShowDebug(!showDebug)}
            variant="outline"
            size="sm"
          >
            <Database className="w-4 h-4 mr-2" />
            {showDebug ? 'Hide' : 'Show'} Debug
          </Button>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="mb-8">
            <DebugDatabaseTest />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <AdvancedSearchBar
            onSearch={searchMusic}
            onClear={clearSearch}
            isLoading={isSearching}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library">Your Library</TabsTrigger>
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="social">Social Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            {libraryLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading your music library...</p>
                </div>
              </div>
            ) : (
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
            )}
          </TabsContent>

          <TabsContent value="search">
            <SearchResults
              results={searchResults}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              isInFavorites={isInFavorites}
            />
          </TabsContent>

          <TabsContent value="playlists">
            {playlistLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading your playlists...</p>
                </div>
              </div>
            ) : (
              <PlaylistManager onPlayPlaylist={handlePlayPlaylist} />
            )}
          </TabsContent>

          <TabsContent value="social">
            <SocialMusicFeed
              following={following}
              followers={followers}
              onFollowUser={followUser}
              onUnfollowUser={unfollowUser}
              onLikeTrack={likeTrack}
              onUnlikeTrack={unlikeTrack}
              onLikePlaylist={likePlaylist}
              onUnlikePlaylist={unlikePlaylist}
              isFollowing={isFollowing}
              isTrackLiked={isTrackLiked}
              isPlaylistLiked={isPlaylistLiked}
            />
          </TabsContent>
        </Tabs>

        {/* Status Info */}
        {(libraryLoading || playlistLoading || isSearching) && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">
                {libraryLoading && 'Loading library...'}
                {playlistLoading && 'Loading playlists...'}
                {isSearching && 'Searching...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioBrowser;
