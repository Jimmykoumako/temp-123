
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Crown } from "lucide-react";
import FullscreenButton from "./FullscreenButton";

interface HymnHeaderProps {
  onBack: () => void;
  mode: 'hymnal' | 'display';
  showQR: boolean;
  onToggleQR: () => void;
  groupSession?: {sessionId: string, isLeader: boolean} | null;
}

const HymnHeader = ({ onBack, mode, showQR, onToggleQR, groupSession }: HymnHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Hymns
        </Button>
        
        {groupSession && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            {groupSession.isLeader ? (
              <Crown className="w-4 h-4 text-yellow-600" />
            ) : (
              <Users className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-sm text-slate-700">
              {groupSession.isLeader ? 'Leading' : 'Following'} • {groupSession.sessionId}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {mode === 'display' && (
          <Button 
            onClick={onToggleQR} 
            variant="outline"
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </Button>
        )}
        <FullscreenButton />
      </div>
    </div>
  );
};

export default HymnHeader;
