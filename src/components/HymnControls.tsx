
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Users, Crown, UserCheck, UserX } from "lucide-react";

interface HymnControlsProps {
  currentVerse: number;
  totalVerses: number;
  isPlaying: boolean;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onTogglePlay: () => void;
  isGroupLeader?: boolean;
  isCoLeader?: boolean;
  isFollowingLeader?: boolean;
  onToggleFollowLeader?: () => void;
}

const HymnControls = ({ 
  currentVerse, 
  totalVerses, 
  isPlaying, 
  onPrevVerse, 
  onNextVerse, 
  onTogglePlay,
  isGroupLeader,
  isCoLeader,
  isFollowingLeader,
  onToggleFollowLeader
}: HymnControlsProps) => {
  const isInGroupSession = isGroupLeader !== undefined;
  const canControl = !isInGroupSession || isGroupLeader || isCoLeader || !isFollowingLeader;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4 border">
        <Button 
          onClick={onPrevVerse} 
          disabled={currentVerse === 0 || !canControl} 
          size="sm"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button 
          onClick={onTogglePlay} 
          disabled={!canControl}
          size="sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button 
          onClick={onNextVerse} 
          disabled={currentVerse === totalVerses - 1 || !canControl} 
          size="sm"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        
        <div className="text-sm text-slate-600 ml-4">
          Verse {currentVerse + 1} of {totalVerses}
        </div>
        
        {isInGroupSession && (
          <div className="flex items-center gap-2 ml-2">
            {isGroupLeader && (
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Crown className="w-3 h-3" />
                <span>Leader</span>
              </div>
            )}
            {isCoLeader && !isGroupLeader && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <Crown className="w-3 h-3" />
                <span>Co-leader</span>
              </div>
            )}
            {!isGroupLeader && !isCoLeader && (
              <>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Users className="w-3 h-3" />
                  <span>Participant</span>
                </div>
                {onToggleFollowLeader && (
                  <Button
                    onClick={onToggleFollowLeader}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    {isFollowingLeader ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Independent
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnControls;
