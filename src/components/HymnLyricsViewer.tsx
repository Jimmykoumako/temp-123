
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import HymnSearchBar from "./hymn-lyrics/HymnSearchBar";
import HymnLyricsList from "./hymn-lyrics/HymnLyricsList";
import HymnLyricsDisplay from "./hymn-lyrics/HymnLyricsDisplay";

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

interface HymnLyricsViewerProps {
  onBack: () => void;
  selectedHymnbook?: any;
}

const HymnLyricsViewer = ({ onBack, selectedHymnbook }: HymnLyricsViewerProps) => {
  const [hymns, setHymns] = useState<HymnLyric[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<HymnLyric | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnLyrics();
  }, [selectedHymnbook]);

  const fetchHymnLyrics = async () => {
    try {
      setLoading(true);
      const bookId = selectedHymnbook?.id || 1;

      const { data, error } = await supabase
        .from('HymnLyric')
        .select('*')
        .eq('bookId', bookId)
        .order('hymnTitleNumber');

      if (error) throw error;

      // Cast the Json type to LyricsData for each hymn with proper type checking
      const typedHymns: HymnLyric[] = (data || []).map(hymn => ({
        ...hymn,
        lyrics: hymn.lyrics as unknown as LyricsData
      }));

      setHymns(typedHymns);
    } catch (error) {
      console.error('Error fetching hymn lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to load hymn lyrics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHymns = hymns.filter(hymn =>
    hymn.hymnTitleNumber.includes(searchTerm) ||
    JSON.stringify(hymn.lyrics).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading hymn lyrics...</p>
        </div>
      </div>
    );
  }

  if (selectedHymn) {
    return (
      <HymnLyricsDisplay 
        hymn={selectedHymn} 
        onBack={() => setSelectedHymn(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">
              Hymn Lyrics Viewer
            </h1>
          </div>
          {selectedHymnbook && (
            <div className="text-right">
              <h2 className="text-lg font-semibold text-slate-700">
                {selectedHymnbook.name}
              </h2>
              <p className="text-sm text-slate-500">{selectedHymnbook.description}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <HymnSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* Hymns List */}
        <HymnLyricsList 
          hymns={filteredHymns} 
          onHymnSelect={setSelectedHymn} 
        />
      </div>
    </div>
  );
};

export default HymnLyricsViewer;
