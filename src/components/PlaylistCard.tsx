
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, MoreHorizontal } from 'lucide-react';

interface PlaylistCardProps {
  title: string;
  description?: string;
  trackCount: number;
  coverImage?: string;
  onPlay: () => void;
}

const PlaylistCard = ({ title, description, trackCount, coverImage, onPlay }: PlaylistCardProps) => {
  return (
    <Card className="group hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4">
            {coverImage ? (
              <img src={coverImage} alt={title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Music className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <Button
            onClick={onPlay}
            size="sm"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{trackCount} songs</span>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
