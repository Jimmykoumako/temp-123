import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Smartphone } from "lucide-react";
import { hymns } from "@/data/hymns";

interface RemoteControlProps {
  deviceId: string;
  onBack: () => void;
}

const RemoteControl = ({ deviceId, onBack }: RemoteControlProps) => {
  const [connectedDeviceId, setConnectedDeviceId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null);

  const sendCommand = (command: string, data?: any) => {
    if (isConnected) {
      const event = new CustomEvent(`remote-${connectedDeviceId}`, {
        detail: { command, data }
      });
      window.dispatchEvent(event);
    }
  };

  const connectToDevice = () => {
    if (connectedDeviceId.trim()) {
      setIsConnected(true);
    }
  };

  const selectHymn = (hymnId: number) => {
    setSelectedHymn(hymnId);
    sendCommand('selectHymn', { hymnId: hymnId.toString() });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="text-center mb-6">
                <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Remote Control</h1>
                <p className="text-slate-600">Connect to a presentation display</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Device ID or QR Code
                  </label>
                  <Input
                    value={connectedDeviceId}
                    onChange={(e) => setConnectedDeviceId(e.target.value)}
                    placeholder="Enter device ID"
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={connectToDevice} 
                  className="w-full"
                  disabled={!connectedDeviceId.trim()}
                >
                  Connect
                </Button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">How to connect:</h3>
                <ol className="text-sm text-slate-600 space-y-1">
                  <li>1. Open Presentation Mode on the display device</li>
                  <li>2. Scan the QR code or enter the device ID above</li>
                  <li>3. Tap Connect to start controlling</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Playback Controls</h2>
            <div className="grid grid-cols-3 gap-4">
              <Button onClick={() => sendCommand('prevVerse')} size="lg">
                <SkipBack className="w-6 h-6" />
              </Button>
              <Button onClick={() => sendCommand('togglePlay')} size="lg">
                <Play className="w-6 h-6" />
              </Button>
              <Button onClick={() => sendCommand('nextVerse')} size="lg">
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Hymn Selection</h2>
            <div className="grid grid-cols-4 gap-2">
              {hymns.slice(0, 12).map((hymn) => (
                <Button
                  key={hymn.id}
                  onClick={() => selectHymn(hymn.id)}
                  variant={selectedHymn === hymn.id ? "default" : "outline"}
                  size="sm"
                  className="h-16 flex flex-col"
                >
                  <div className="font-bold">#{hymn.number}</div>
                  <div className="text-xs text-center leading-tight">
                    {hymn.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Number Entry</h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <Button key={num} variant="outline" size="lg">
                  {num}
                </Button>
              ))}
            </div>
            <Button className="w-full mt-4">Go to Hymn</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RemoteControl;
