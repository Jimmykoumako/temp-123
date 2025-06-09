
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Search, Grid, List } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

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
        duration: '3:45' // Default duration - you could calculate this
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
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const trackIndex = tracks.findIndex(t => t.id === trackId);
    
    if (currentTrack?.id === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.hymnNumber?.includes(searchQuery)
  );

  const recentTracks = tracks.slice(0, 10);
  const popularHymns = tracks.filter(track => 
    ['1', '23', '45', '123', '256'].includes(track.hymnNumber || '')
  );

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
              <p className="text-muted-foreground">Your hymn collection</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hymns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Quick Access Playlists */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PlaylistCard
              title="Recent Hymns"
              description="Your recently played hymns"
              trackCount={recentTracks.length}
              onPlay={() => {
                if (recentTracks.length > 0) {
                  handlePlayTrack(recentTracks[0].id);
                }
              }}
            />
            <PlaylistCard
              title="Popular Hymns"
              description="Most loved hymns"
              trackCount={popularHymns.length}
              onPlay={() => {
                if (popularHymns.length > 0) {
                  handlePlayTrack(popularHymns[0].id);
                }
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
              title="Favorites"
              description="Your favorite hymns"
              trackCount={0}
              onPlay={() => {}}
            />
          </div>
        </section>

        {/* Main Content */}
        {searchQuery ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Search Results ({filteredTracks.length})
            </h2>
            <TrackList
              tracks={filteredTracks}
              currentTrack={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
            />
          </section>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
              <TrackList
                tracks={recentTracks}
                currentTrack={currentTrack?.id}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
              />
            </section>

            {popularHymns.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Popular Hymns</h2>
                <TrackList
                  tracks={popularHymns}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              </section>
            )}
          </>
        )}

        {tracks.length === 0 && (
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
        playlist={tracks}
      />
    </div>
  );
};

export default AudioBrowser;
