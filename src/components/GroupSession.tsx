
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Users, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GroupSessionProps {
  deviceId: string;
  onBack: () => void;
  onJoinSession: (sessionId: string, isLeader: boolean) => void;
}

const GroupSession = ({ deviceId, onBack, onJoinSession }: GroupSessionProps) => {
  const [sessionId, setSessionId] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate a 4-digit session code
  const generateSessionCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createSession = () => {
    const newSessionId = generateSessionCode();
    setSessionId(newSessionId);
    setIsLeader(true);
    
    // Store session in localStorage for persistence
    localStorage.setItem('groupSession', JSON.stringify({
      sessionId: newSessionId,
      isLeader: true,
      deviceId: deviceId
    }));

    toast({
      title: "Session Created",
      description: `Session code: ${newSessionId}`,
    });
  };

  const joinSession = () => {
    if (joinCode.length === 4) {
      setSessionId(joinCode);
      setIsLeader(false);
      
      localStorage.setItem('groupSession', JSON.stringify({
        sessionId: joinCode,
        isLeader: false,
        deviceId: deviceId
      }));

      onJoinSession(joinCode, false);
    }
  };

  const startLeaderSession = () => {
    onJoinSession(sessionId, true);
  };

  const copySessionCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Session code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const qrCodeUrl = sessionId ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL-GROUP:${sessionId}`)}` 
    : "";

  // Check for existing session on mount
  useEffect(() => {
    const existingSession = localStorage.getItem('groupSession');
    if (existingSession) {
      const session = JSON.parse(existingSession);
      setSessionId(session.sessionId);
      setIsLeader(session.isLeader);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            ← Back to Home
          </Button>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Group Session</h1>
              <p className="text-slate-600">Create or join a group session for synchronized hymn navigation</p>
            </div>

            {!sessionId ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4">Create New Session (Leader)</h3>
                  <Button onClick={createSession} className="w-full" size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Join Existing Session</h3>
                  <div className="space-y-3">
                    <Input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.slice(0, 4))}
                      placeholder="Enter 4-digit code"
                      className="text-center text-lg"
                      maxLength={4}
                    />
                    <Button 
                      onClick={joinSession} 
                      className="w-full"
                      disabled={joinCode.length !== 4}
                    >
                      Join Session
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-slate-100 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-slate-800 mb-2">{sessionId}</div>
                    <div className="text-sm text-slate-600">
                      {isLeader ? 'You are the session leader' : 'You have joined the session'}
                    </div>
                  </div>

                  {isLeader && (
                    <>
                      <div className="flex gap-2 mb-4">
                        <Button onClick={copySessionCode} variant="outline" className="flex-1">
                          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          {copied ? 'Copied!' : 'Copy Code'}
                        </Button>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">QR Code</h3>
                        <div className="flex justify-center">
                          <img 
                            src={qrCodeUrl} 
                            alt="Session QR Code" 
                            className="w-32 h-32 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Scan to join session</p>
                      </div>
                    </>
                  )}

                  <Button 
                    onClick={startLeaderSession} 
                    className="w-full" 
                    size="lg"
                  >
                    {isLeader ? 'Start Leading Session' : 'Enter Session'}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">How it works</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Leaders:</strong> Create a session and share the 4-digit code or QR code with participants.</p>
              <p><strong>Participants:</strong> Join using the code to follow along with the leader's navigation.</p>
              <p><strong>Sync:</strong> All participants will see the same hymn and verse as the leader in real-time.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupSession;
