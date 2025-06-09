
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SessionInfoCard from "@/components/session/SessionInfoCard";
import ParticipantsList from "@/components/session/ParticipantsList";
import SessionStatistics from "@/components/session/SessionStatistics";

interface FullscreenSessionManagementProps {
  isVisible: boolean;
  onClose: () => void;
  sessionDetails: any;
  participants: any[];
  isLeader: boolean;
  onPromoteToCoLeader: (participantId: string) => void;
  onRemoveParticipant: (participantId: string) => void;
  onUpdateSessionSettings: (settings: any) => void;
}

const FullscreenSessionManagement = ({
  isVisible,
  onClose,
  sessionDetails,
  participants,
  isLeader,
  onPromoteToCoLeader,
  onRemoveParticipant,
  onUpdateSessionSettings
}: FullscreenSessionManagementProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Session Management</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <SessionInfoCard
            sessionDetails={sessionDetails}
            isLeader={isLeader}
            onUpdateSessionSettings={onUpdateSessionSettings}
          />

          <ParticipantsList
            participants={participants}
            sessionDetails={sessionDetails}
            isLeader={isLeader}
            onPromoteToCoLeader={onPromoteToCoLeader}
            onRemoveParticipant={onRemoveParticipant}
          />

          <SessionStatistics participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default FullscreenSessionManagement;
