
import { useState } from "react";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LyricsSection from "./LyricsSection";
import LyricsControls from "./LyricsControls";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface HymnLyric {
  id: number;
  hymnTitleNumber: string;
  lyrics: LyricsData;
  userId: string;
  bookId: number;
}

interface HymnLyricsDisplayProps {
  hymn: HymnLyric;
  onBack: () => void;
}

const HymnLyricsDisplay = ({ hymn, onBack }: HymnLyricsDisplayProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showSyllables, setShowSyllables] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSection = () => {
    if (currentSection < (hymn.lyrics.order?.length || 1) - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderOrderedLyrics = (hymn: HymnLyric) => {
    const { lyrics } = hymn;
    
    return (
      <div className="space-y-4">
        {lyrics.order?.map((sectionId, index) => {
          if (sectionId.startsWith('verse')) {
            const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
            const verse = lyrics.verses?.[verseIndex];
            if (verse) {
              return (
                <div key={`${sectionId}-${index}`}>
                  <LyricsSection 
                    lines={verse} 
                    sectionType="verse" 
                    index={verseIndex} 
                    showSyllables={showSyllables}
                  />
                </div>
              );
            }
          } else if (sectionId.startsWith('chorus')) {
            const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
            const chorus = lyrics.choruses?.[chorusIndex];
            if (chorus) {
              return (
                <div key={`${sectionId}-${index}`}>
                  <LyricsSection 
                    lines={chorus} 
                    sectionType="chorus" 
                    index={chorusIndex} 
                    showSyllables={showSyllables}
                  />
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">
              Hymn #{hymn.hymnTitleNumber}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSyllables(!showSyllables)}
              variant="outline"
              size="sm"
            >
              {showSyllables ? 'Hide' : 'Show'} Syllables
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Lyrics Display */}
        <Card className="p-8 bg-white shadow-xl max-w-4xl mx-auto">
          {renderOrderedLyrics(hymn)}
        </Card>

        {/* Controls */}
        <LyricsControls
          currentSection={currentSection}
          totalSections={hymn.lyrics.order?.length || 1}
          onPrevious={prevSection}
          onNext={nextSection}
        />
      </div>
    </div>
  );
};

export default HymnLyricsDisplay;
