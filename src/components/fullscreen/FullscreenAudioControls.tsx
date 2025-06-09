
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, Volume2, VolumeX, Music } from "lucide-react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";

interface FullscreenAudioControlsProps {
  hymnNumber: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const FullscreenAudioControls = ({ 
  hymnNumber, 
  isVisible, 
  onToggleVisibility 
}: FullscreenAudioControlsProps) => {
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

  if (audioFiles.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggleVisibility}
        variant="outline"
        size="sm"
        className="fixed top-6 left-6 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Music className="w-4 h-4 mr-2" />
        Audio ({audioFiles.length})
        {isPlaying && (
          <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
        )}
      </Button>

      {/* Audio Controls Panel */}
      {isVisible && (
        <Card className="fixed top-20 left-6 w-80 max-h-96 pointer-events-auto bg-black/80 backdrop-blur-sm border-white/20 overflow-hidden">
          <div className="p-3 border-b border-white/20">
            <h3 className="text-white font-semibold">Audio Files</h3>
            <p className="text-slate-400 text-sm">
              {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {loading ? (
            <div className="p-4 text-center">
              <div className="text-white">Loading audio files...</div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-64">
              {audioFiles.map((audioFile) => (
                <div
                  key={audioFile.id}
                  className={`p-3 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors ${
                    currentAudioFile?.id === audioFile.id ? 'bg-white/20' : ''
                  }`}
                  onClick={() => playAudio(audioFile)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
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
                        className="text-white hover:bg-white/20 w-8 h-8 p-0"
                      >
                        {currentAudioFile?.id === audioFile.id && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          Audio File #{audioFile.audioTypeId}
                        </p>
                        <p className="text-slate-400 text-xs truncate">
                          {new Date(audioFile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {currentAudioFile?.id === audioFile.id && isPlaying && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          stopAudio();
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
                      >
                        <Square className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {currentAudioFile?.id === audioFile.id && currentAudio && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(currentAudio.currentTime / currentAudio.duration) * 100 || 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {Math.floor(currentAudio.currentTime / 60)}:
                        {String(Math.floor(currentAudio.currentTime % 60)).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {audioFiles.length === 0 && !loading && (
            <div className="p-4 text-center text-slate-400">
              No audio files available for this hymn.
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default FullscreenAudioControls;
