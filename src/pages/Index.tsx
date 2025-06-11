
import { useState, useEffect } from "react";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import EnhancedGroupSession from "@/components/EnhancedGroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/landing/HeroSection";
import HymnOfTheDayCarousel from "@/components/landing/HymnOfTheDayCarousel";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import GettingStartedSection from "@/components/landing/GettingStartedSection";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";
import { hymns } from "@/data/hymns";

const Index = () => {
  const [mode, setMode] = useState<'select' | 'hymnal' | 'remote' | 'display' | 'browse' | 'lyrics' | 'group' | 'audio'>('select');
  const [deviceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);
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

  // Set default mode based on orientation when hymn is selected
  useEffect(() => {
    if (mode === 'select' && selectedHymn && !groupSession) {
      if (isLandscape) {
        setMode('display');
      } else {
        setMode('hymnal');
      }
    }
  }, [selectedHymn, isLandscape, mode, groupSession]);

  const resetToHome = () => {
    setMode('select');
    setSelectedHymnbook(null);
    setSelectedHymn(null);
    setGroupSession(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleHymnbookSelect = (hymnbook) => {
    setSelectedHymnbook(hymnbook);
  };

  const handleHymnSelect = (hymn) => {
    setSelectedHymn(hymn);
    // Create a mock hymnbook if none selected
    if (!selectedHymnbook) {
      setSelectedHymnbook({
        id: 'default',
        title: 'Selected Hymn',
        hymns: [hymn]
      });
    }
  };

  const handleJoinSession = (sessionId: string, isLeader: boolean) => {
    setGroupSession({ sessionId, isLeader });
    setMode('hymnal');
  };

  const handleAudioMode = () => {
    window.location.href = '/audio';
  };

  const handlePlayHymn = (hymn) => {
    // For now, just select the hymn - could be enhanced to actually play audio
    handleHymnSelect(hymn);
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

  if (mode === 'audio') {
    handleAudioMode();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AppHeader onModeSelect={setMode} />
      <HeroSection onModeSelect={setMode} />
      <HymnOfTheDayCarousel onPlayHymn={handlePlayHymn} onSelectHymn={handleHymnSelect} />
      <FeaturesShowcase onModeSelect={setMode} />
      <GettingStartedSection isLandscape={isLandscape} onModeSelect={setMode} />
    </div>
  );
};

export default Index;
