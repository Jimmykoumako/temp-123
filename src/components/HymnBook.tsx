import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEnhancedGroupSync } from "@/hooks/useEnhancedGroupSync";
import HymnDisplay from "./HymnDisplay";
import QRCodeDisplay from "./QRCodeDisplay";
import HymnList from "./HymnList";
import HymnControls from "./HymnControls";
import HymnHeader from "./HymnHeader";
import HymnPageHeader from "./HymnPageHeader";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface HymnBookProps {
  mode: 'hymnal' | 'display';
  deviceId: string;
  onBack: () => void;
  selectedHymnbook?: any;
  groupSession?: {sessionId: string, isLeader: boolean} | null;
}

const HymnBook = ({ mode, deviceId, onBack, selectedHymnbook, groupSession }: HymnBookProps) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9)); // Simulated user ID
  const { toast } = useToast();

  // Enhanced group synchronization
  const [groupState, groupActions] = useEnhancedGroupSync(userId);

  useEffect(() => {
    fetchHymns();
  }, [selectedHymnbook]);

  const fetchHymns = async () => {
    try {
      setLoading(true);
      
      // If a hymnbook is selected, fetch hymns from that book
      const bookId = selectedHymnbook?.id || 1; // Default to book 1 if no hymnbook selected
      
      // Only fetch from active hymnbooks
      const { data: hymnbookData, error: hymnbookError } = await supabase
        .from('HymnBook')
        .select('is_active')
        .eq('id', bookId)
        .single();

      if (hymnbookError) throw hymnbookError;
      
      if (!hymnbookData?.is_active) {
        toast({
          title: "Notice",
          description: "This hymnbook is currently inactive.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch hymn titles for the selected book
      const { data: hymnTitles, error: titlesError } = await supabase
        .from('HymnTitle')
        .select('number, titles')
        .eq('bookId', bookId)
        .order('number');

      if (titlesError) throw titlesError;

      // Fetch hymn lyrics for the selected book
      const { data: hymnLyrics, error: lyricsError } = await supabase
        .from('HymnLyric')
        .select('hymnTitleNumber, lyrics')
        .eq('bookId', bookId);

      if (lyricsError) throw lyricsError;

      // Combine titles and lyrics
      const combinedHymns: Hymn[] = hymnTitles.map(title => {
        const lyrics = hymnLyrics.find(l => l.hymnTitleNumber === title.number);
        const lyricsData = lyrics?.lyrics as any;
        
        console.log(`Processing hymn ${title.number}:`, lyricsData);
        
        // Extract verses from the structured lyrics data
        const verses = [];
        if (lyricsData?.verses && Array.isArray(lyricsData.verses)) {
          // Handle array format where each verse is an array of lines
          lyricsData.verses.forEach((verse: any, index: number) => {
            if (Array.isArray(verse)) {
              // Convert array of line objects to text
              const verseText = verse.map((line: any) => line.text || line).join('\n');
              verses.push(verseText);
            } else if (typeof verse === 'string') {
              verses.push(verse);
            }
          });
        } else if (lyricsData?.verses && typeof lyricsData.verses === 'object') {
          // Handle object format with verse1, verse2, etc.
          for (let i = 1; i <= 10; i++) {
            const verseKey = `verse${i}`;
            if (lyricsData.verses[verseKey]) {
              const verse = lyricsData.verses[verseKey];
              if (Array.isArray(verse)) {
                const verseText = verse.map((line: any) => line.text || line).join('\n');
                verses.push(verseText);
              } else if (typeof verse === 'string') {
                verses.push(verse);
              }
            }
          }
        }

        // Extract chorus
        let chorus = undefined;
        if (lyricsData?.choruses && Array.isArray(lyricsData.choruses) && lyricsData.choruses[0]) {
          const chorusData = lyricsData.choruses[0];
          if (Array.isArray(chorusData)) {
            chorus = chorusData.map((line: any) => line.text || line).join('\n');
          } else if (typeof chorusData === 'string') {
            chorus = chorusData;
          }
        } else if (lyricsData?.chorus) {
          chorus = lyricsData.chorus;
        }

        console.log(`Hymn ${title.number} processed:`, { verses, chorus });

        return {
          id: `${bookId}-${title.number}`,
          number: title.number,
          title: title.titles?.[0] || 'Untitled Hymn',
          author: lyricsData?.author || 'Unknown',
          verses: verses.length > 0 ? verses : ['No lyrics available'],
          chorus: chorus,
          key: lyricsData?.key || 'C',
          tempo: lyricsData?.tempo || 120
        };
      });

      console.log('All processed hymns:', combinedHymns);
      setHymns(combinedHymns);
    } catch (error) {
      console.error('Error fetching hymns:', error);
      toast({
        title: "Error",
        description: "Failed to load hymns.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced group sync event listeners
  useEffect(() => {
    if (!groupSession) return;

    const handleGroupHymnChange = (event: CustomEvent) => {
      const { hymnId } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        setSelectedHymn(hymnId);
        setCurrentVerse(0);
        if (!groupState.isLeader && !groupState.isCoLeader) {
          toast({
            title: "Hymn Changed",
            description: "Leader changed the hymn",
          });
        }
      }
    };

    const handleGroupVerseChange = (event: CustomEvent) => {
      const { verse } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        setCurrentVerse(verse);
        if (!groupState.isLeader && !groupState.isCoLeader) {
          toast({
            title: "Verse Changed",
            description: `Now on verse ${verse + 1}`,
          });
        }
      }
    };

    const handleGroupPlayChange = (event: CustomEvent) => {
      const { isPlaying: playing } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        setIsPlaying(playing);
      }
    };

    window.addEventListener('group-hymn-change', handleGroupHymnChange);
    window.addEventListener('group-verse-change', handleGroupVerseChange);
    window.addEventListener('group-play-change', handleGroupPlayChange);

    return () => {
      window.removeEventListener('group-hymn-change', handleGroupHymnChange);
      window.removeEventListener('group-verse-change', handleGroupVerseChange);
      window.removeEventListener('group-play-change', handleGroupPlayChange);
    };
  }, [groupSession, groupState.isLeader, groupState.isCoLeader, groupState.isFollowingLeader, toast]);

  // Listen for remote control commands
  useEffect(() => {
    const handleRemoteCommand = (event: CustomEvent) => {
      const { command, data } = event.detail;
      
      switch (command) {
        case 'selectHymn':
          handleHymnSelect(data.hymnId);
          break;
        case 'nextVerse':
          nextVerse();
          break;
        case 'prevVerse':
          prevVerse();
          break;
        case 'togglePlay':
          togglePlay();
          break;
      }
    };

    window.addEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
    return () => window.removeEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
  }, [deviceId, selectedHymn, currentVerse, hymns]);

  const handleHymnSelect = async (hymnId: string) => {
    setSelectedHymn(hymnId);
    setCurrentVerse(0);
    setIsPlaying(false);
    
    // Broadcast to group if leader or co-leader
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastHymnChange(hymnId);
    }
  };

  const handleVerseChange = async (verse: number) => {
    setCurrentVerse(verse);
    
    // Broadcast to group if leader or co-leader
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastVerseChange(verse);
    }
  };

  const nextVerse = async () => {
    if (selectedHymn !== null) {
      const hymn = hymns.find(h => h.id === selectedHymn);
      if (hymn && currentVerse < hymn.verses.length - 1) {
        const newVerse = currentVerse + 1;
        setCurrentVerse(newVerse);
        
        // Broadcast to group if leader or co-leader
        if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
          await groupActions.broadcastVerseChange(newVerse);
        }
      }
    }
  };

  const prevVerse = async () => {
    if (currentVerse > 0) {
      const newVerse = currentVerse - 1;
      setCurrentVerse(newVerse);
      
      // Broadcast to group if leader or co-leader
      if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
        await groupActions.broadcastVerseChange(newVerse);
      }
    }
  };

  const togglePlay = async () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    // Broadcast to group if leader or co-leader
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastPlayState(newPlayState);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading hymns...</p>
        </div>
      </div>
    );
  }

  if (selectedHymn === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <HymnPageHeader 
            onBack={onBack}
            mode={mode}
            showQR={showQR}
            onToggleQR={() => setShowQR(!showQR)}
            selectedHymnbook={selectedHymnbook}
            groupSession={groupSession}
          />

          {showQR && mode === 'display' && (
            <QRCodeDisplay deviceId={deviceId} />
          )}

          <HymnList 
            hymns={hymns}
            onHymnSelect={handleHymnSelect}
            selectedHymnbook={selectedHymnbook}
          />
        </div>
      </div>
    );
  }

  const selectedHymnData = hymns.find(h => h.id === selectedHymn);
  if (!selectedHymnData) return null;

  console.log('Rendering hymn:', selectedHymnData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <HymnHeader 
          onBack={() => setSelectedHymn(null)}
          mode={mode}
          showQR={showQR}
          onToggleQR={() => setShowQR(!showQR)}
          groupSession={groupSession}
        />

        {showQR && mode === 'display' && (
          <QRCodeDisplay deviceId={deviceId} />
        )}

        <HymnDisplay 
          hymn={selectedHymnData}
          currentVerse={currentVerse}
          isPlaying={isPlaying}
          mode={mode}
          onVerseChange={handleVerseChange}
        />

        {mode === 'hymnal' && (
          <HymnControls 
            currentVerse={currentVerse}
            totalVerses={selectedHymnData.verses.length}
            isPlaying={isPlaying}
            onPrevVerse={prevVerse}
            onNextVerse={nextVerse}
            onTogglePlay={togglePlay}
            isGroupLeader={groupSession?.isLeader}
            isCoLeader={groupState.isCoLeader}
            isFollowingLeader={groupState.isFollowingLeader}
            onToggleFollowLeader={groupActions.toggleFollowLeader}
          />
        )}
      </div>
    </div>
  );
};

export default HymnBook;
