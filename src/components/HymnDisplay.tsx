
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import HymnHeader from "./hymn-display/HymnHeader";
import LyricsFocusButton from "./hymn-display/LyricsFocusButton";
import HymnDisplayMode from "./hymn-display/HymnDisplayMode";
import HymnHymnalMode from "./hymn-display/HymnHymnalMode";
import PlayingIndicator from "./hymn-display/PlayingIndicator";

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

interface HymnDisplayProps {
  hymn: Hymn;
  currentVerse: number;
  isPlaying: boolean;
  mode: 'hymnal' | 'display';
  onVerseChange?: (verse: number) => void;
}

const HymnDisplay = ({ hymn, currentVerse, isPlaying, mode, onVerseChange }: HymnDisplayProps) => {
  const [isLyricsOnly, setIsLyricsOnly] = useState(false);
  const displaySize = mode === 'display' ? 'text-4xl' : 'text-2xl';
  const titleSize = mode === 'display' ? 'text-6xl' : 'text-3xl';

  // Handle keyboard navigation for presentation mode
  useEffect(() => {
    if (mode !== 'display') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        if (currentVerse < hymn.verses.length - 1) {
          onVerseChange?.(currentVerse + 1);
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentVerse > 0) {
          onVerseChange?.(currentVerse - 1);
        }
      } else if (event.key === 'Home') {
        event.preventDefault();
        onVerseChange?.(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        onVerseChange?.(hymn.verses.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentVerse, hymn.verses.length, onVerseChange]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white shadow-xl">
        <HymnHeader 
          hymn={hymn} 
          isLyricsOnly={isLyricsOnly} 
          titleSize={titleSize} 
        />

        {mode === 'display' && (
          <LyricsFocusButton 
            isLyricsOnly={isLyricsOnly}
            onToggle={() => setIsLyricsOnly(!isLyricsOnly)}
          />
        )}

        <div className="space-y-8">
          {mode === 'display' ? (
            <HymnDisplayMode 
              hymn={hymn}
              currentVerse={currentVerse}
              isLyricsOnly={isLyricsOnly}
              displaySize={displaySize}
              onVerseChange={onVerseChange}
            />
          ) : (
            <HymnHymnalMode 
              hymn={hymn}
              currentVerse={currentVerse}
              displaySize={displaySize}
            />
          )}
        </div>

        <PlayingIndicator isPlaying={isPlaying} />
      </Card>
    </div>
  );
};

export default HymnDisplay;
