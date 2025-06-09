
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";
import FullscreenPresentation from "../FullscreenPresentation";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface HymnDisplayModeProps {
  hymn: Hymn;
  currentVerse: number;
  isLyricsOnly: boolean;
  displaySize: string;
  onVerseChange?: (verse: number) => void;
}

const HymnDisplayMode = ({ hymn, currentVerse, isLyricsOnly, displaySize, onVerseChange }: HymnDisplayModeProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <FullscreenPresentation
        hymn={hymn}
        currentVerse={currentVerse}
        onVerseChange={onVerseChange || (() => {})}
        onExit={() => setIsFullscreen(false)}
      />
    );
  }

  // Lyrics-only focused view
  if (isLyricsOnly) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-white z-40 flex items-center justify-center">
        <div className="w-full max-w-4xl px-8 text-center">
          <div className="text-4xl md:text-5xl lg:text-6xl leading-relaxed font-light">
            {hymn.verses[currentVerse] && hymn.verses[currentVerse].split('\n').map((line, lineIdx) => (
              <div key={lineIdx} className="mb-6 lg:mb-8 text-purple-300">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular display mode
  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Fullscreen button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsFullscreen(true)}
          variant="outline"
          size="sm"
          className="bg-white/50 hover:bg-white/80"
        >
          <Maximize className="w-4 h-4 mr-2" />
          Fullscreen Presentation
        </Button>
      </div>

      <Carousel 
        className="w-full max-w-4xl mx-auto"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {hymn.verses.map((verse, index) => (
            <CarouselItem key={index}>
              <div className="text-center p-6">
                <div className="text-2xl font-semibold text-blue-600 mb-8">
                  Verse {index + 1}
                </div>
                <div className={`${displaySize} leading-relaxed text-slate-800 max-w-3xl mx-auto`}>
                  {verse.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} className="mb-4">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
          {hymn.chorus && (
            <CarouselItem>
              <div className="text-center p-6">
                <div className="text-2xl font-semibold text-yellow-700 mb-8">
                  Chorus
                </div>
                <div className={`${displaySize} leading-relaxed text-slate-800 max-w-3xl mx-auto`}>
                  {hymn.chorus.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} className="mb-4">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      <div className="text-center mt-8 text-slate-500">
        <p className="text-lg">Verse {currentVerse + 1} of {hymn.verses.length}</p>
        <p className="text-sm mt-2">Use arrow keys, spacebar, or swipe to navigate • Home/End for first/last verse</p>
      </div>
    </div>
  );
};

export default HymnDisplayMode;
