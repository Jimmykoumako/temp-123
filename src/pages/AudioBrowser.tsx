
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Search, Grid, List, Library, Plus } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';
import PlaylistManager from '@/components/music/PlaylistManager';
import AdvancedSearchBar from '@/components/music/AdvancedSearchBar';
import LibraryBrowser from '@/components/music/LibraryBrowser';
import SearchResults from '@/components/music/SearchResults';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';

interface AudioFile {
  id: string;
  url: string;
  hymnTitleNumber: string;
  userId: string;
  audioTypeId: number;
  createdAt: string;
  bookId: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  hymnNumber?: string;
  album?: string;
  duration?: string;
}

const AudioBrowser = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const { toast } = useToast();

  // Use the new hooks
  const { tracks: libraryTracks, albums, artists, addToRecentlyPlayed } = useMusicLibrary();
  const { playlists } = usePlaylistManager();
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
  } = useAdvancedSearch(libraryTracks, albums, artists);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('AudioFile')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching audio files:', error);
        toast({
          title: "Error",
          description: "Failed to fetch audio files",
          variant: "destructive"
        });
        return;
      }

      setAudioFiles(data || []);
      
      // Transform to tracks format
      const transformedTracks: Track[] = (data || []).map(file => ({
        id: file.id,
        title: `Hymn #${file.hymnTitleNumber}`,
        artist: 'HBC Hymns',
        url: getAudioUrl(file.url),
        hymnNumber: file.hymnTitleNumber,
        album: `Book ${file.bookId}`,
        duration: '3:45'
      }));
      
      setTracks(transformedTracks);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAudioUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('audio_files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePlayTrack = (trackId: string) => {
    const track = libraryTracks.find(t => t.id === trackId) || tracks.find(t => t.id === trackId);
    if (!track) return;

    const allTracks = [...libraryTracks, ...tracks];
    const trackIndex = allTracks.findIndex(t => t.id === trackId);
    
    if (currentTrack?.id === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
      addToRecentlyPlayed(track);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.tracks && playlist.tracks.length > 0) {
      handlePlayTrack(playlist.tracks[0].id);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const allTracks = [...libraryTracks, ...tracks];
    const nextIndex = (currentTrackIndex + 1) % allTracks.length;
    setCurrentTrack(allTracks[nextIndex]);
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const allTracks = [...libraryTracks, ...tracks];
    const prevIndex = currentTrackIndex === 0 ? allTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrack(allTracks[prevIndex]);
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleSearch = (searchQuery: string) => {
    addToSearchHistory(searchQuery);
    setActiveTab('search');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg">Loading your music library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-40 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">HBC Music</h1>
              <p className="text-muted-foreground">Your complete music experience</p>
            </div>
          </div>
          
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Browse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <LibraryBrowser
              onPlayTrack={handlePlayTrack}
              currentTrack={currentTrack?.id}
              isPlaying={isPlaying}
            />
          </TabsContent>

          <TabsContent value="playlists">
            <PlaylistManager onPlayPlaylist={handlePlayPlaylist} />
          </TabsContent>

          <TabsContent value="search">
            <SearchResults
              results={searchResults}
              query={query}
              currentTrack={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
            />
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-8">
              {/* Quick Access */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PlaylistCard
                    title="Recently Added"
                    description="Your latest uploads"
                    trackCount={tracks.slice(0, 10).length}
                    onPlay={() => {
                      if (tracks.length > 0) {
                        handlePlayTrack(tracks[0].id);
                      }
                    }}
                  />
                  <PlaylistCard
                    title="Popular Hymns"
                    description="Most loved hymns"
                    trackCount={tracks.filter(t => ['1', '23', '45'].includes(t.hymnNumber || '')).length}
                    onPlay={() => {
                      const popular = tracks.find(t => ['1', '23', '45'].includes(t.hymnNumber || ''));
                      if (popular) handlePlayTrack(popular.id);
                    }}
                  />
                  <PlaylistCard
                    title="All Hymns"
                    description="Complete collection"
                    trackCount={tracks.length}
                    onPlay={() => {
                      if (tracks.length > 0) {
                        handlePlayTrack(tracks[0].id);
                      }
                    }}
                  />
                  <PlaylistCard
                    title="My Playlists"
                    description="Your custom playlists"
                    trackCount={playlists.length}
                    onPlay={() => {
                      if (playlists.length > 0) {
                        handlePlayPlaylist(playlists[0].id);
                      }
                    }}
                  />
                </div>
              </section>

              {/* Recently Added */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
                <TrackList
                  tracks={tracks.slice(0, 10)}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              </section>
            </div>
          </TabsContent>
        </Tabs>

        {tracks.length === 0 && !loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Music Found</h3>
              <p className="text-muted-foreground text-center">
                No audio files are currently available in your library.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        playlist={[...libraryTracks, ...tracks]}
      />
    </div>
  );
};

export default AudioBrowser;
