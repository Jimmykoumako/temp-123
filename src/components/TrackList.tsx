
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, MoreHorizontal, Heart } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  hymnNumber?: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  title?: string;
}

const TrackList = ({ tracks, currentTrack, isPlaying, onPlayTrack, title }: TrackListProps) => {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="space-y-1">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack === track.id;
            const showPlayButton = isCurrentTrack && isPlaying;

            return (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg group cursor-pointer"
                onClick={() => onPlayTrack(track.id)}
              >
                <div className="w-8 text-center">
                  {isCurrentTrack ? (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      {showPlayButton ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                  )}
                  <Play className="h-4 w-4 hidden group-hover:block" />
                </div>

                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                  <Music className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>
                      {track.title}
                    </h4>
                    {track.hymnNumber && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        #{track.hymnNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>

                {track.album && (
                  <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">{track.album}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4" />
                  </Button>
                  {track.duration && (
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {track.duration}
                    </span>
                  )}
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackList;
