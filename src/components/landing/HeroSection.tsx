
import { Book, Heart, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onModeSelect: (mode: 'browse' | 'hymnal' | 'display' | 'lyrics') => void;
}

const HeroSection = ({ onModeSelect }: HeroSectionProps) => {
  return (
    <section className="relative py-12 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Book className="w-20 h-20 text-primary" />
              <Heart className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Anthems of Faith
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Experience worship through timeless hymns with modern technology
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Start Your Worship Journey</h2>
          <p className="text-slate-600 mb-6">Explore hymns, join group sessions, or dive into presentation mode</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onModeSelect('browse')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Music className="w-5 h-5 mr-2" />
              Explore Hymns
            </Button>
            <Button 
              onClick={() => onModeSelect('display')}
              variant="outline" 
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Presentation
            </Button>
          </div>
        </div>

        {/* Scripture Verse */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20">
          <blockquote className="text-lg md:text-xl font-serif text-slate-700 italic leading-relaxed mb-3">
            "Sing unto the LORD a new song, and his praise from the end of the earth"
          </blockquote>
          <cite className="text-md text-slate-600 font-medium">— Isaiah 42:10 (KJV)</cite>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
