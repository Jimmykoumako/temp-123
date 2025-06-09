
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Crown, Copy, Check, Settings, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEnhancedGroupSync } from "@/hooks/useEnhancedGroupSync";

interface EnhancedGroupSessionProps {
  userId: string;
  onBack: () => void;
  onJoinSession: (sessionId: string, isLeader: boolean) => void;
}

const EnhancedGroupSession = ({ userId, onBack, onJoinSession }: EnhancedGroupSessionProps) => {
  const [groupState, groupActions] = useEnhancedGroupSync(userId);
  const [activeTab, setActiveTab] = useState("join");
  const [joinCode, setJoinCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Session creation form
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    password: "",
    requirePassword: false,
    scheduledStart: "",
    scheduledEnd: ""
  });

  const { toast } = useToast();

  const handleCreateSession = async () => {
    try {
      const sessionCode = await groupActions.createSession({
        title: sessionForm.title || "Worship Session",
        description: sessionForm.description,
        password: sessionForm.requirePassword ? sessionForm.password : null,
        scheduledStart: sessionForm.scheduledStart || null,
        scheduledEnd: sessionForm.scheduledEnd || null
      });
      
      setActiveTab("manage");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    }
  };

  const handleJoinSession = async () => {
    try {
      await groupActions.joinSession(joinCode, joinPassword);
      onJoinSession(groupState.sessionId!, false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join session",
        variant: "destructive",
      });
    }
  };

  const startSession = () => {
    onJoinSession(groupState.sessionId!, groupState.isLeader);
  };

  const copySessionCode = async () => {
    if (!groupState.sessionDetails?.session_code) return;
    
    try {
      await navigator.clipboard.writeText(groupState.sessionDetails.session_code);
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

  const promoteParticipant = async (participantId: string) => {
    try {
      await groupActions.promoteToCoLeader(participantId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote participant",
        variant: "destructive",
      });
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      await groupActions.removeParticipant(participantId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      });
    }
  };

  const qrCodeUrl = groupState.sessionDetails?.session_code ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL-SESSION:${groupState.sessionDetails.session_code}`)}` 
    : "";

  // If already in a session, show management interface
  if (groupState.sessionId && groupState.sessionDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              ← Back to Home
            </Button>
            <div className="flex items-center gap-2">
              {groupState.isLeader && <Crown className="w-5 h-5 text-yellow-600" />}
              <span className="text-sm text-slate-600">
                {groupState.isLeader ? "Session Leader" : "Participant"}
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-6">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {groupState.sessionDetails.title || "Worship Session"}
                </h1>
                {groupState.sessionDetails.description && (
                  <p className="text-slate-600 mb-4">{groupState.sessionDetails.description}</p>
                )}
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-slate-800 mb-2">
                    {groupState.sessionDetails.session_code}
                  </div>
                  <div className="text-sm text-slate-600 mb-3">Session Code</div>
                  <Button onClick={copySessionCode} variant="outline" size="sm">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="participants">Participants ({groupState.participants.length})</TabsTrigger>
                  {groupState.isLeader && <TabsTrigger value="settings">Settings</TabsTrigger>}
                  <TabsTrigger value="share">Share</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">Participants</span>
                      </div>
                      <div className="text-2xl font-bold">{groupState.participants.length}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Status</span>
                      </div>
                      <div className="text-lg font-semibold text-green-600">Active</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">Current Hymn</span>
                      </div>
                      <div className="text-sm">{groupState.selectedHymn || "None selected"}</div>
                    </Card>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={startSession} className="flex-1" size="lg">
                      {groupState.isLeader ? 'Start Leading Session' : 'Join Session'}
                    </Button>
                    {!groupState.isLeader && (
                      <Button 
                        onClick={groupActions.toggleFollowLeader} 
                        variant={groupState.isFollowingLeader ? "default" : "outline"}
                      >
                        {groupState.isFollowingLeader ? "Following Leader" : "Independent Mode"}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <div className="space-y-2">
                    {groupState.participants.map((participant) => (
                      <Card key={participant.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                              {participant.user_id ? 'U' : 'G'}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {participant.device_name || 'Anonymous User'}
                              </div>
                              <div className="text-sm text-slate-600 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  participant.connection_status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                }`}></span>
                                {participant.connection_status}
                                {participant.is_co_leader && (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                    Co-leader
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {groupState.isLeader && participant.user_id !== userId && (
                            <div className="flex gap-2">
                              {!participant.is_co_leader && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => promoteParticipant(participant.id)}
                                >
                                  <Crown className="w-4 h-4 mr-1" />
                                  Promote
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => removeParticipant(participant.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {groupState.isLeader && (
                  <TabsContent value="settings" className="space-y-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Session Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="session-title">Session Title</Label>
                          <Input 
                            id="session-title"
                            value={groupState.sessionDetails.title || ''}
                            onChange={(e) => {
                              groupActions.updateSessionSettings({ title: e.target.value });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="session-desc">Description</Label>
                          <Textarea 
                            id="session-desc"
                            value={groupState.sessionDetails.description || ''}
                            onChange={(e) => {
                              groupActions.updateSessionSettings({ description: e.target.value });
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password-protection">Password Protection</Label>
                          <Switch 
                            id="password-protection"
                            checked={!!groupState.sessionDetails.password_hash}
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                )}

                <TabsContent value="share" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">QR Code</h3>
                      <div className="flex justify-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="Session QR Code" 
                          className="w-48 h-48 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Scan to join session</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Share Link</h3>
                      <div className="flex gap-2">
                        <Input 
                          value={`${window.location.origin}?join=${groupState.sessionDetails.session_code}`}
                          readOnly
                        />
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}?join=${groupState.sessionDetails.session_code}`);
                            toast({ title: "Link copied to clipboard" });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Initial session creation/joining interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            ← Back to Home
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Enhanced Group Session</h1>
              <p className="text-slate-600">Create or join a group session with advanced features</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join">Join Session</TabsTrigger>
                <TabsTrigger value="create">Create Session</TabsTrigger>
              </TabsList>

              <TabsContent value="join" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="join-code">Session Code</Label>
                    <Input
                      id="join-code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.slice(0, 4))}
                      placeholder="Enter 4-digit code"
                      className="text-center text-lg"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="join-password">Password (if required)</Label>
                    <div className="relative">
                      <Input
                        id="join-password"
                        type={showPassword ? "text" : "password"}
                        value={joinPassword}
                        onChange={(e) => setJoinPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={handleJoinSession} 
                    className="w-full"
                    disabled={joinCode.length !== 4}
                  >
                    Join Session
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Worship Session"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={sessionForm.description}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the session"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-password">Require Password</Label>
                    <Switch 
                      id="require-password"
                      checked={sessionForm.requirePassword}
                      onCheckedChange={(checked) => setSessionForm(prev => ({ ...prev, requirePassword: checked }))}
                    />
                  </div>
                  {sessionForm.requirePassword && (
                    <div>
                      <Label htmlFor="password">Session Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={sessionForm.password}
                        onChange={(e) => setSessionForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                      />
                    </div>
                  )}
                  <Button 
                    onClick={handleCreateSession} 
                    className="w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-slate-800 mb-3">Enhanced Features</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Leaders:</strong> Create sessions with titles, passwords, and scheduled times.</p>
              <p><strong>Co-leaders:</strong> Promote participants to help manage the session.</p>
              <p><strong>Advanced Sync:</strong> Real-time updates with connection status tracking.</p>
              <p><strong>Independent Mode:</strong> Participants can navigate independently when needed.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGroupSession;
