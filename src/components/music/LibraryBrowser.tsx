
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, User, Disc, Heart, Clock, Grid, List } from 'lucide-react';
import TrackList from '@/components/TrackList';

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

interface LibraryBrowserProps {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  recentlyPlayed: Track[];
  favorites: Track[];
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (track: Track) => void;
  isInFavorites: (trackId: string) => boolean;
}

const LibraryBrowser = ({ 
  tracks, 
  albums, 
  artists, 
  recentlyPlayed, 
  favorites, 
  onPlayTrack, 
  onToggleFavorite,
  isInFavorites 
}: LibraryBrowserProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentTrack, setCurrentTrack] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onPlayTrack(track);
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center p-4">
          <Music className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">{tracks.length}</p>
            <p className="text-sm text-muted-foreground">Songs</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <Disc className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">{albums.length}</p>
            <p className="text-sm text-muted-foreground">Albums</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <User className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">{artists.length}</p>
            <p className="text-sm text-muted-foreground">Artists</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <Heart className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">{favorites.length}</p>
            <p className="text-sm text-muted-foreground">Favorites</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AlbumGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {albums.map((album) => (
        <Card key={album.id} className="group hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-4">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4">
              {album.coverImage ? (
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Disc className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-lg">{album.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{album.artist}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{album.trackCount} tracks</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ArtistGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {artists.map((artist) => (
        <Card key={artist.name} className="group hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-4">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">{artist.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {artist.trackCount} songs • {artist.albums.length} albums
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <QuickStats />

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recently Played
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="tracks" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            All Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="flex items-center gap-2">
            <Disc className="h-4 w-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger value="artists" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Artists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <TrackList
            tracks={recentlyPlayed}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            title="Recently Played"
          />
        </TabsContent>

        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <TrackList
              tracks={favorites}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              title="Your Favorites"
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground text-center">
                  Start adding songs to your favorites by clicking the heart icon.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tracks">
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            title="All Songs"
          />
        </TabsContent>

        <TabsContent value="albums">
          <AlbumGrid />
        </TabsContent>

        <TabsContent value="artists">
          <ArtistGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryBrowser;
