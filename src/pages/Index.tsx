
import { useState, useEffect } from "react";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import EnhancedGroupSession from "@/components/EnhancedGroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import GettingStartedSection from "@/components/landing/GettingStartedSection";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";
import { Button } from "@/components/ui/button";
import { Music, Users, BookOpen, Radio, Mic, Search } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState<'select' | 'hymnal' | 'remote' | 'display' | 'browse' | 'lyrics' | 'group' | 'audio'>('select');
  const [deviceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9)); // Simulated user ID
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [groupSession, setGroupSession] = useState<{sessionId: string, isLeader: boolean} | null>(null);
  const isLandscape = useLandscapeDetection();

  // Check URL for auto-join session code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode && mode === 'select') {
      setMode('group');
    }
  }, [mode]);

  // Set default mode based on orientation
  useEffect(() => {
    if (mode === 'select' && selectedHymnbook && !groupSession) {
      // When a hymnbook is selected, choose mode based on orientation
      if (isLandscape) {
        setMode('display');
      } else {
        setMode('hymnal');
      }
    }
  }, [selectedHymnbook, isLandscape, mode, groupSession]);

  const resetToHome = () => {
    setMode('select');
    setSelectedHymnbook(null);
    setGroupSession(null);
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleHymnbookSelect = (hymnbook) => {
    setSelectedHymnbook(hymnbook);
    // Mode will be set automatically by useEffect based on orientation
  };

  const handleJoinSession = (sessionId: string, isLeader: boolean) => {
    setGroupSession({ sessionId, isLeader });
    // Automatically go to hymnal mode after joining session
    setMode('hymnal');
  };

  // Navigate to audio browser
  const handleAudioMode = () => {
    // Use React Router navigation instead of mode state
    window.location.href = '/audio';
  };

  if (mode === 'browse') {
    return <HymnbookBrowser onBack={resetToHome} onSelectHymnbook={handleHymnbookSelect} />;
  }

  if (mode === 'lyrics') {
    return <HymnLyricsViewer onBack={resetToHome} selectedHymnbook={selectedHymnbook} />;
  }

  if (mode === 'group') {
    return (
      <EnhancedGroupSession 
        userId={userId} 
        onBack={resetToHome} 
        onJoinSession={handleJoinSession} 
      />
    );
  }

  if (mode === 'hymnal') {
    return (
      <HymnBook 
        mode="hymnal" 
        deviceId={deviceId} 
        onBack={resetToHome} 
        selectedHymnbook={selectedHymnbook}
        groupSession={groupSession}
      />
    );
  }

  if (mode === 'remote') {
    return <RemoteControl deviceId={deviceId} onBack={resetToHome} />;
  }

  if (mode === 'display') {
    return (
      <HymnBook 
        mode="display" 
        deviceId={deviceId} 
        onBack={resetToHome} 
        selectedHymnbook={selectedHymnbook}
        groupSession={groupSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AppHeader onModeSelect={setMode} />
      <HeroSection />
      
      {/* Enhanced Features Grid with Music */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Mode</h2>
          <p className="text-lg text-slate-600">Select how you'd like to experience worship</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Button
            onClick={() => setMode('browse')}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-blue-50 transition-colors"
          >
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold">Browse Hymnbooks</div>
              <div className="text-sm text-slate-600">Explore available collections</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('lyrics')}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-purple-50 transition-colors"
          >
            <Search className="w-8 h-8 text-purple-600" />
            <div>
              <div className="font-semibold">Search Lyrics</div>
              <div className="text-sm text-slate-600">Find hymns by text</div>
            </div>
          </Button>

          <Button
            onClick={handleAudioMode}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-green-50 transition-colors"
          >
            <Music className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-semibold">Music Library</div>
              <div className="text-sm text-slate-600">Browse and play audio</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('group')}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-indigo-50 transition-colors"
          >
            <Users className="w-8 h-8 text-indigo-600" />
            <div>
              <div className="font-semibold">Group Session</div>
              <div className="text-sm text-slate-600">Worship together remotely</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('remote')}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-orange-50 transition-colors"
          >
            <Radio className="w-8 h-8 text-orange-600" />
            <div>
              <div className="font-semibold">Remote Control</div>
              <div className="text-sm text-slate-600">Control presentations</div>
            </div>
          </Button>

          <Button
            onClick={() => window.location.href = '/admin'}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center space-y-3 text-center hover:bg-red-50 transition-colors"
          >
            <Mic className="w-8 h-8 text-red-600" />
            <div>
              <div className="font-semibold">Admin Panel</div>
              <div className="text-sm text-slate-600">Manage content</div>
            </div>
          </Button>
        </div>
      </div>

      <GettingStartedSection isLandscape={isLandscape} onModeSelect={setMode} />
    </div>
  );
};

export default Index;
