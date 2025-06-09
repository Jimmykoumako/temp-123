
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Share2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SessionInfoCardProps {
  sessionDetails: any;
  isLeader: boolean;
  onUpdateSessionSettings: (settings: any) => void;
}

const SessionInfoCard = ({ sessionDetails, isLeader, onUpdateSessionSettings }: SessionInfoCardProps) => {
  const [settings, setSettings] = useState({
    title: sessionDetails?.title || '',
    description: sessionDetails?.description || '',
    passwordProtected: !!sessionDetails?.password_hash,
    password: '',
    allowParticipantControl: true
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    onUpdateSessionSettings({
      title: settings.title,
      description: settings.description,
      password_hash: settings.passwordProtected && settings.password ? btoa(settings.password) : null
    });
    
    toast({
      title: "Settings Updated",
      description: "Session settings have been saved successfully",
    });
  };

  const copySessionCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionDetails?.session_code || '');
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

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Session Information</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            {sessionDetails?.session_code}
          </Badge>
          <Button onClick={copySessionCode} variant="outline" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {isLeader && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter session description"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="password-protection">Password Protection</Label>
              <p className="text-sm text-gray-600">Require a password to join this session</p>
            </div>
            <Switch
              id="password-protection"
              checked={settings.passwordProtected}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordProtected: checked }))}
            />
          </div>

          {settings.passwordProtected && (
            <div>
              <Label htmlFor="password">Session Password</Label>
              <Input
                id="password"
                type="password"
                value={settings.password}
                onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter session password"
              />
            </div>
          )}

          <Button onClick={handleSaveSettings} className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      )}
      
      {!isLeader && (
        <div className="text-gray-600">
          <p><strong>Title:</strong> {sessionDetails?.title || 'Untitled Session'}</p>
          {sessionDetails?.description && (
            <p><strong>Description:</strong> {sessionDetails.description}</p>
          )}
          <p><strong>Created:</strong> {new Date(sessionDetails?.created_at).toLocaleDateString()}</p>
        </div>
      )}
    </Card>
  );
};

export default SessionInfoCard;
