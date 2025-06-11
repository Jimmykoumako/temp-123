
import { useState } from "react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";
import { useFullscreenControls } from "@/hooks/useFullscreenControls";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import HymnAudioPlayer from "@/components/hymn-audio/HymnAudioPlayer";
import FullscreenContent from "@/components/fullscreen/FullscreenContent";

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

interface FullscreenPresentationProps {
  hymn: Hymn;
  currentVerse: number;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
}

const FullscreenPresentation = ({ hymn, currentVerse, onVerseChange, onExit }: FullscreenPresentationProps) => {
  const [fontSize, setFontSize] = useState(6);
  const [currentHymn, setCurrentHymn] = useState<Hymn>(hymn);

  // Font size classes array for easy indexing
  const fontSizeClasses = [
    'text-xl',    // 0
    'text-2xl',   // 1
    'text-3xl',   // 2
    'text-4xl',   // 3
    'text-5xl',   // 4
    'text-6xl',   // 5
    'text-7xl',   // 6
    'text-8xl',   // 7
    'text-9xl'    // 8
  ];

  // Custom hooks
  const { showControls } = useFullscreenControls();
  const audioHook = useFullscreenAudio(currentHymn.number);
  const hymnBuffer = useHymnBuffer();

  // Handle hymn changes from buffer
  const handleSelectHymnFromBuffer = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn);
    onVerseChange(0); // Reset to first verse
    hymnBuffer.setCurrentHymn(selectedHymn.id);
  };

  // Get current content based on current verse
  const getCurrentContent = () => {
    if (currentVerse < currentHymn.verses.length) {
      return {
        type: 'verse' as const,
        number: currentVerse + 1,
        content: currentHymn.verses[currentVerse]
      };
    } else if (currentHymn.chorus) {
      return {
        type: 'chorus' as const,
        number: null,
        content: currentHymn.chorus
      };
    }
    return null;
  };

  const content = getCurrentContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      <FullscreenContent
        title={currentHymn.title}
        content={content}
        fontSizeClass={fontSizeClasses[fontSize]}
        currentVerse={currentVerse}
        totalVerses={currentHymn.verses.length}
        hasChorus={!!currentHymn.chorus}
        isPlayingAudio={audioHook.isPlaying}
        hymn={currentHymn}
        onExit={onExit}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        currentVerseIndex={currentVerse}
        onVerseChange={onVerseChange}
      />

      {/* Compact Audio Player - positioned at top center */}
      {showControls && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto z-60">
          <HymnAudioPlayer 
            hymnNumber={currentHymn.number}
            isCompact={true}
            showTitle={false}
          />
        </div>
      )}

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center">
          <div>Arrow keys or spacebar to navigate • Up/Down arrows for font size • P to play/pause • S to stop • Home/End for first/last • Esc to exit</div>
          <div className="text-xs mt-1">Search button (bottom right) • Buffer (top right) for hymn queue • Audio player (top center)</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
