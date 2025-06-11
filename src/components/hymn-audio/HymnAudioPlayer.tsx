
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFullscreenAudio } from '@/hooks/useFullscreenAudio';

interface HymnAudioPlayerProps {
  hymnNumber: string;
  isCompact?: boolean;
  showTitle?: boolean;
}

const HymnAudioPlayer = ({ hymnNumber, isCompact = false, showTitle = true }: HymnAudioPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    audioFiles,
    currentAudio,
    isPlaying,
    currentAudioFile,
    loading,
    playAudio,
    togglePlayPause,
    stopAudio
  } = useFullscreenAudio(hymnNumber);

  // Update volume when slider changes
  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = volume / 100;
    }
  }, [volume, currentAudio]);

  // Don't render if no audio files
  if (audioFiles.length === 0 && !loading) {
    return null;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    if (currentAudio) {
      currentAudio.currentTime = value[0];
    }
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm">Loading audio...</span>
          </div>
        ) : audioFiles.length > 0 ? (
          <>
            <Button
              onClick={() => {
                if (currentAudioFile) {
                  togglePlayPause();
                } else {
                  playAudio(audioFiles[0]);
                }
              }}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            {currentAudioFile && (
              <>
                {currentAudio && (
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Slider
                      value={[currentAudio.currentTime]}
                      max={currentAudio.duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-xs whitespace-nowrap">
                      {formatTime(currentAudio.currentTime)}/{formatTime(currentAudio.duration || 0)}
                    </span>
                  </div>
                )}
                
                <Button
                  onClick={stopAudio}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Square className="w-3 h-3" />
                </Button>
              </>
            )}
            
            <span className="text-xs text-muted-foreground">
              {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''}
            </span>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              {showTitle && <span>Hymn Audio</span>}
              {loading ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''} available
                </span>
              )}
              {isPlaying && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading audio files...</p>
            </div>
          ) : audioFiles.length > 0 ? (
            <div className="space-y-3">
              {/* Audio Files List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {audioFiles.map((audioFile, index) => (
                  <div
                    key={audioFile.id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                      currentAudioFile?.id === audioFile.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => playAudio(audioFile)}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentAudioFile?.id === audioFile.id) {
                          togglePlayPause();
                        } else {
                          playAudio(audioFile);
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {currentAudioFile?.id === audioFile.id && isPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Audio File #{index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(audioFile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Playing Controls */}
              {currentAudioFile && currentAudio && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={togglePlayPause}
                      variant="outline"
                      size="sm"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      onClick={stopAudio}
                      variant="outline"
                      size="sm"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Now Playing</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentAudio.currentTime]}
                      max={currentAudio.duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentAudio.currentTime)}</span>
                      <span>{formatTime(currentAudio.duration || 0)}</span>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">
                      {volume}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No audio files available for this hymn.
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default HymnAudioPlayer;
