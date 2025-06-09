
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Home, Square } from "lucide-react";

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

interface FullscreenNavigationControlsProps {
  hymn: Hymn;
  currentVerse: number;
  content: {
    type: 'verse' | 'chorus';
    number: number | null;
    content: string;
  };
  canGoPrevious: boolean;
  canGoNext: boolean;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
  onStopAudio: () => void;
}

const FullscreenNavigationControls = ({
  hymn,
  currentVerse,
  content,
  canGoPrevious,
  canGoNext,
  onVerseChange,
  onExit,
  onStopAudio
}: FullscreenNavigationControlsProps) => {
  return (
    <>
      {/* Navigation controls - center sides */}
      {canGoPrevious && (
        <Button
          onClick={() => onVerseChange(currentVerse - 1)}
          variant="outline"
          size="lg"
          className="fixed left-6 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12 z-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {canGoNext && (
        <Button
          onClick={() => {
            if (currentVerse < hymn.verses.length - 1) {
              onVerseChange(currentVerse + 1);
            } else if (hymn.chorus) {
              onVerseChange(hymn.verses.length);
            }
          }}
          variant="outline"
          size="lg"
          className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12 z-50"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Quick navigation - bottom center */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/20">
          <Button
            onClick={() => onVerseChange(0)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            disabled={currentVerse === 0}
          >
            <Home className="w-4 h-4" />
          </Button>
          
          <div className="text-white text-sm px-2 min-w-[80px] text-center">
            {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
          </div>
          
          <Button
            onClick={() => {
              if (hymn.chorus) {
                onVerseChange(hymn.verses.length);
              } else {
                onVerseChange(hymn.verses.length - 1);
              }
            }}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            disabled={!hymn.chorus && currentVerse === hymn.verses.length - 1}
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default FullscreenNavigationControls;
