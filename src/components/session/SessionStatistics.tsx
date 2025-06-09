
import { Card } from "@/components/ui/card";

interface SessionStatisticsProps {
  participants: any[];
}

const SessionStatistics = ({ participants }: SessionStatisticsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Session Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
          <div className="text-sm text-gray-600">Total Participants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {participants.filter(p => p.connection_status === 'connected').length}
          </div>
          <div className="text-sm text-gray-600">Online Now</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {participants.filter(p => p.is_co_leader).length}
          </div>
          <div className="text-sm text-gray-600">Co-leaders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {participants.filter(p => p.is_following_leader).length}
          </div>
          <div className="text-sm text-gray-600">Following Leader</div>
        </div>
      </div>
    </Card>
  );
};

export default SessionStatistics;
