
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FullscreenSearchButton from "./FullscreenSearchButton";
import FullscreenHymnSearch from "./FullscreenHymnSearch";
import FullscreenNavigationControls from "./FullscreenNavigationControls";
import FullscreenFontControls from "./FullscreenFontControls";
import FullscreenHymnBuffer from "./FullscreenHymnBuffer";
import FullscreenAudioControls from "./FullscreenAudioControls";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";

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

interface FullscreenContentProps {
  title: string;
  content: {
    type: 'verse' | 'chorus';
    number: number | null;
    content: string;
  };
  fontSizeClass: string;
  currentVerse: number;
  totalVerses: number;
  hasChorus: boolean;
  isPlayingAudio: boolean;
  hymn: Hymn;
  onExit: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  currentVerseIndex: number;
  onVerseChange: (index: number) => void;
}

const FullscreenContent = ({
  title,
  content,
  fontSizeClass,
  currentVerse,
  totalVerses,
  hasChorus,
  isPlayingAudio,
  hymn,
  onExit,
  fontSize,
  onFontSizeChange,
  currentVerseIndex,
  onVerseChange
}: FullscreenContentProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBufferVisible, setIsBufferVisible] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [showIntroCarousel, setShowIntroCarousel] = useState(true);
  
  const {
    hymnBuffer,
    currentBufferIndex,
    addToBuffer,
    removeFromBuffer,
    moveToNext,
    moveToPrevious,
    setCurrentHymn
  } = useHymnBuffer();

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onExit();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          setShowIntroCarousel(false);
          const maxVerse = hymn.chorus ? hymn.verses.length : hymn.verses.length - 1;
          if (currentVerseIndex < maxVerse) {
            onVerseChange(currentVerseIndex + 1);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setShowIntroCarousel(false);
          if (currentVerseIndex > 0) {
            onVerseChange(currentVerseIndex - 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          onFontSizeChange(Math.min(fontSize + 1, 8));
          break;
        case 'ArrowDown':
          event.preventDefault();
          onFontSizeChange(Math.max(fontSize - 1, 0));
          break;
        case 'Home':
          event.preventDefault();
          setShowIntroCarousel(false);
          onVerseChange(0);
          break;
        case 'End':
          event.preventDefault();
          setShowIntroCarousel(false);
          if (hymn.chorus) {
            onVerseChange(hymn.verses.length);
          } else {
            onVerseChange(hymn.verses.length - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVerseIndex, hymn, onVerseChange, onExit, fontSize, onFontSizeChange]);

  // Add current hymn to buffer when component mounts
  useEffect(() => {
    addToBuffer(hymn);
  }, [hymn, addToBuffer]);

  const handleSelectHymn = (selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id);
    setIsSearchOpen(false);
    setShowIntroCarousel(true); // Show intro for new hymn
  };

  const handleBufferHymnSelect = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id);
    setIsBufferVisible(false);
    setShowIntroCarousel(true); // Show intro for new hymn
  };

  // Hide intro after 5 seconds or when user navigates
  useEffect(() => {
    if (showIntroCarousel) {
      const timer = setTimeout(() => {
        setShowIntroCarousel(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showIntroCarousel]);

  // Hide intro when user changes verse manually
  useEffect(() => {
    if (currentVerseIndex > 0) {
      setShowIntroCarousel(false);
    }
  }, [currentVerseIndex]);

  // Calculate responsive font size based on screen size
  const getResponsiveFontSize = () => {
    const screenWidth = window.innerWidth;
    
    // Base font size calculation - smaller default
    let baseFontSize = 16; // Reduced from 24
    
    // Adjust based on screen size
    if (screenWidth >= 1920) { // Large desktop
      baseFontSize = 20;
    } else if (screenWidth >= 1440) { // Desktop
      baseFontSize = 18;
    } else if (screenWidth >= 1024) { // Tablet landscape
      baseFontSize = 16;
    } else if (screenWidth >= 768) { // Tablet portrait
      baseFontSize = 14;
    } else { // Mobile
      baseFontSize = 12;
    }
    
    // Apply font size multiplier (each step adds 4px instead of 8px)
    return baseFontSize + (fontSize * 4);
  };

  const fontSizeInPx = getResponsiveFontSize();

  // Ensure we have valid content
  if (!content || !content.content) {
    console.log('No content available:', { content, hymn });
    return (
      <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="fixed top-6 right-6 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">No Content Available</h2>
            <p className="text-xl text-slate-400">Please select a hymn to display</p>
          </div>
        </div>
      </div>
    );
  }

  // Intro carousel slides data
  const introSlides = [
    {
      type: 'number',
      content: `#${hymn.number}`,
      subtitle: 'Hymn Number'
    },
    {
      type: 'title',
      content: title,
      subtitle: 'Title'
    },
    {
      type: 'author',
      content: hymn.author || 'Unknown',
      subtitle: 'Author/Composer'
    }
  ];

  if (showIntroCarousel) {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        
        {/* Exit button */}
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="fixed top-6 right-6 text-white hover:bg-white/20 backdrop-blur-sm z-50"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Search button */}
        <FullscreenSearchButton onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Audio controls */}
        <FullscreenAudioControls
          hymnNumber={hymn.number}
          isVisible={isAudioVisible}
          onToggleVisibility={() => setIsAudioVisible(!isAudioVisible)}
        />

        {/* Buffer controls */}
        <FullscreenHymnBuffer
          hymnBuffer={hymnBuffer}
          currentBufferIndex={currentBufferIndex}
          onSelectHymn={handleBufferHymnSelect}
          onRemoveFromBuffer={removeFromBuffer}
          isVisible={isBufferVisible}
          onToggleVisibility={() => setIsBufferVisible(!isBufferVisible)}
        />

        {/* Font controls */}
        <FullscreenFontControls
          fontSize={fontSize}
          maxFontSize={9}
          onIncreaseFontSize={() => onFontSizeChange(Math.min(fontSize + 1, 8))}
          onDecreaseFontSize={() => onFontSizeChange(Math.max(fontSize - 1, 0))}
        />

        {/* Intro Carousel */}
        <div className="flex items-center justify-center h-full p-8 relative z-10">
          <div className="max-w-4xl w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {introSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="text-center space-y-6">
                      <p 
                        className="text-blue-300 mb-4"
                        style={{ fontSize: `${Math.floor(fontSizeInPx * 0.6)}px` }}
                      >
                        {slide.subtitle}
                      </p>
                      <h1 
                        className="font-bold leading-tight"
                        style={{ 
                          fontSize: slide.type === 'number' ? `${Math.floor(fontSizeInPx * 1.5)}px` : `${fontSizeInPx}px`,
                          color: slide.type === 'number' ? '#93c5fd' : 'white'
                        }}
                      >
                        {slide.content}
                      </h1>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-8 bg-black/50 border-white/20 text-white hover:bg-black/70" />
              <CarouselNext className="right-8 bg-black/50 border-white/20 text-white hover:bg-black/70" />
            </Carousel>
            
            {/* Skip button */}
            <div className="text-center mt-8">
              <Button
                onClick={() => setShowIntroCarousel(false)}
                variant="outline"
                className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              >
                Skip to Lyrics
              </Button>
            </div>
            
            {/* Auto-advance indicator */}
            <div className="text-center mt-4">
              <p className="text-slate-400 text-sm">
                Will advance to lyrics automatically in 5 seconds...
              </p>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <FullscreenHymnSearch
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onAddToBuffer={addToBuffer}
            bufferHymnIds={hymnBuffer.map(h => h.id)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
      
      {/* Exit button */}
      <Button
        onClick={onExit}
        variant="ghost"
        size="sm"
        className="fixed top-6 right-6 text-white hover:bg-white/20 backdrop-blur-sm z-50"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Search button */}
      <FullscreenSearchButton onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Audio controls */}
      <FullscreenAudioControls
        hymnNumber={hymn.number}
        isVisible={isAudioVisible}
        onToggleVisibility={() => setIsAudioVisible(!isAudioVisible)}
      />

      {/* Buffer controls */}
      <FullscreenHymnBuffer
        hymnBuffer={hymnBuffer}
        currentBufferIndex={currentBufferIndex}
        onSelectHymn={handleBufferHymnSelect}
        onRemoveFromBuffer={removeFromBuffer}
        isVisible={isBufferVisible}
        onToggleVisibility={() => setIsBufferVisible(!isBufferVisible)}
      />

      {/* Navigation controls */}
      <FullscreenNavigationControls
        hymn={hymn}
        currentVerse={currentVerseIndex}
        content={content}
        canGoPrevious={currentVerseIndex > 0}
        canGoNext={currentVerseIndex < hymn.verses.length - 1 || (hymn.chorus && currentVerseIndex < hymn.verses.length)}
        onVerseChange={onVerseChange}
        onExit={onExit}
        onStopAudio={() => {}}
      />

      {/* Font controls */}
      <FullscreenFontControls
        fontSize={fontSize}
        maxFontSize={9}
        onIncreaseFontSize={() => onFontSizeChange(Math.min(fontSize + 1, 8))}
        onDecreaseFontSize={() => onFontSizeChange(Math.max(fontSize - 1, 0))}
      />

      {/* Main content - Just lyrics without redundant header */}
      <div className="flex items-center justify-center h-full p-8 relative z-10">
        <div className="max-w-6xl w-full text-center space-y-8">
          {/* Minimal verse indicator */}
          <div className="space-y-2">
            <h3 
              className="text-blue-300"
              style={{ fontSize: `${Math.floor(fontSizeInPx * 0.5)}px` }}
            >
              {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
            </h3>
          </div>

          {/* Current verse/chorus with proper line formatting */}
          <div className="space-y-6">
            <div className="space-y-4">
              {content.content.split('\n').map((line, index) => (
                <p 
                  key={index}
                  className="leading-relaxed whitespace-nowrap overflow-visible"
                  style={{ 
                    fontSize: `${fontSizeInPx}px`, 
                    lineHeight: '1.4',
                    minHeight: `${fontSizeInPx * 1.4}px`
                  }}
                >
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </p>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: hymn.verses.length + (hymn.chorus ? 1 : 0) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentVerseIndex ? 'bg-blue-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <FullscreenHymnSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onAddToBuffer={addToBuffer}
          bufferHymnIds={hymnBuffer.map(h => h.id)}
        />
      )}
    </div>
  );
};

export default FullscreenContent;
