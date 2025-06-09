
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, UserCheck, UserX, Clock } from "lucide-react";

interface ParticipantsListProps {
  participants: any[];
  sessionDetails: any;
  isLeader: boolean;
  onPromoteToCoLeader: (participantId: string) => void;
  onRemoveParticipant: (participantId: string) => void;
}

const ParticipantsList = ({ 
  participants, 
  sessionDetails, 
  isLeader, 
  onPromoteToCoLeader, 
  onRemoveParticipant 
}: ParticipantsListProps) => {
  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants ({participants.length})
        </h3>
      </div>

      <div className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {participant.user_id === sessionDetails?.leader_id && (
                  <Crown className="w-4 h-4 text-yellow-600" />
                )}
                {participant.is_co_leader && participant.user_id !== sessionDetails?.leader_id && (
                  <Crown className="w-4 h-4 text-orange-600" />
                )}
                {participant.is_following_leader ? (
                  <UserCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <UserX className="w-4 h-4 text-gray-600" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {participant.device_name || `User ${participant.user_id?.slice(-4)}`}
                  </span>
                  {participant.user_id === sessionDetails?.leader_id && (
                    <Badge variant="secondary" className="text-xs">Leader</Badge>
                  )}
                  {participant.is_co_leader && participant.user_id !== sessionDetails?.leader_id && (
                    <Badge variant="outline" className="text-xs">Co-leader</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {formatLastSeen(participant.last_seen)}
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                    {participant.connection_status}
                  </span>
                </div>
              </div>
            </div>

            {isLeader && participant.user_id !== sessionDetails?.leader_id && (
              <div className="flex gap-2">
                {!participant.is_co_leader && (
                  <Button
                    onClick={() => onPromoteToCoLeader(participant.id)}
                    variant="outline"
                    size="sm"
                  >
                    Promote
                  </Button>
                )}
                <Button
                  onClick={() => onRemoveParticipant(participant.id)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ParticipantsList;
