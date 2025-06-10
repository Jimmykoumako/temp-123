
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Disc, User } from 'lucide-react';
import TrackList from '@/components/TrackList';

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

interface SearchResultsProps {
  results: {
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
    total: number;
  };
  query: string;
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onPlayAlbum?: (albumId: string) => void;
  onPlayArtist?: (artistName: string) => void;
}

const SearchResults = ({
  results,
  query,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayAlbum,
  onPlayArtist
}: SearchResultsProps) => {
  if (!query) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Searching</h3>
          <p className="text-muted-foreground text-center">
            Enter a search term to find songs, albums, and artists.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (results.total === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground text-center">
            No songs, albums, or artists found for "{query}".
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <Badge variant="secondary">{results.total} results</Badge>
      </div>

      {results.tracks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Music className="h-5 w-5" />
            Songs ({results.tracks.length})
          </h3>
          <TrackList
            tracks={results.tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={onPlayTrack}
          />
        </div>
      )}

      {results.albums.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Disc className="h-5 w-5" />
            Albums ({results.albums.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.albums.map((album) => (
              <Card 
                key={album.id} 
                className="group hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onPlayAlbum?.(album.id)}
              >
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
        </div>
      )}

      {results.artists.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Artists ({results.artists.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.artists.map((artist) => (
              <Card 
                key={artist.name} 
                className="group hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onPlayArtist?.(artist.name)}
              >
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
        </div>
      )}
    </div>
  );
};

export default SearchResults;
