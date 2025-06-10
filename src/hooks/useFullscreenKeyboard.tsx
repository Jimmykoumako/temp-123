
import { useEffect } from "react";

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

interface UseFullscreenKeyboardProps {
  hymn: Hymn;
  currentVerse: number;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  currentAudio: HTMLAudioElement | null;
  audioFiles: any[];
  togglePlayPause: () => void;
  playAudio: (audioFile: any) => void;
  stopAudio: () => void;
}

export const useFullscreenKeyboard = ({
  hymn,
  currentVerse,
  onVerseChange,
  onExit,
  fontSize,
  increaseFontSize,
  decreaseFontSize,
  currentAudio,
  audioFiles,
  togglePlayPause,
  playAudio,
  stopAudio
}: UseFullscreenKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default for all handled keys
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          stopAudio();
          onExit();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          const maxVerse = hymn.chorus ? hymn.verses.length : hymn.verses.length - 1;
          if (currentVerse < maxVerse) {
            onVerseChange(currentVerse + 1);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentVerse > 0) {
            onVerseChange(currentVerse - 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          increaseFontSize();
          break;
        case 'ArrowDown':
          event.preventDefault();
          decreaseFontSize();
          break;
        case 'Home':
          event.preventDefault();
          onVerseChange(0);
          break;
        case 'End':
          event.preventDefault();
          if (hymn.chorus) {
            onVerseChange(hymn.verses.length);
          } else {
            onVerseChange(hymn.verses.length - 1);
          }
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          if (currentAudio) {
            togglePlayPause();
          } else if (audioFiles.length > 0) {
            playAudio(audioFiles[0]);
          }
          break;
        case 's':
        case 'S':
          event.preventDefault();
          stopAudio();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVerse, hymn, onVerseChange, onExit, currentAudio, audioFiles, togglePlayPause, playAudio, stopAudio, increaseFontSize, decreaseFontSize]);
};
