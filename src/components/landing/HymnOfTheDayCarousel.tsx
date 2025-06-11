
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Book, Music, Heart } from 'lucide-react';
import { hymns } from '@/data/hymns';

interface HymnOfTheDayCarouselProps {
  onPlayHymn?: (hymn: any) => void;
  onSelectHymn?: (hymn: any) => void;
}

const HymnOfTheDayCarousel = ({ onPlayHymn, onSelectHymn }: HymnOfTheDayCarouselProps) => {
  const [featuredHymns, setFeaturedHymns] = useState<any[]>([]);

  useEffect(() => {
    // Get 5 random hymns for the carousel
    const shuffled = [...hymns].sort(() => 0.5 - Math.random());
    setFeaturedHymns(shuffled.slice(0, 5));
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Music className="w-8 h-8 text-primary" />
            Hymns of the Day
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover beautiful hymns to enrich your worship experience
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredHymns.map((hymn, index) => (
              <CarouselItem key={hymn.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 rounded-full p-3 group-hover:bg-primary/20 transition-colors">
                        <Book className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        #{hymn.number}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 flex-grow">
                      {hymn.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 text-sm">
                      by {hymn.artist}
                    </p>
                    
                    <div className="text-sm text-slate-600 mb-6 line-clamp-3 italic">
                      {hymn.verses[0]?.substring(0, 100)}...
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        onClick={() => onSelectHymn?.(hymn)}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        <Book className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {hymn.url && (
                        <Button 
                          onClick={() => onPlayHymn?.(hymn)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default HymnOfTheDayCarousel;
