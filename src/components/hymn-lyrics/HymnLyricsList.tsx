
import { Music } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LyricsData {
  order: string[];
  verses: any[][];
  choruses: any[][];
}

interface HymnLyric {
  id: number;
  hymnTitleNumber: string;
  lyrics: LyricsData;
  userId: string;
  bookId: number;
}

interface HymnLyricsListProps {
  hymns: HymnLyric[];
  onHymnSelect: (hymn: HymnLyric) => void;
}

const HymnLyricsList = ({ hymns, onHymnSelect }: HymnLyricsListProps) => {
  if (hymns.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-slate-500">
          No hymn lyrics found
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {hymns.map((hymn) => (
          <div
            key={hymn.id}
            className="flex items-start justify-between p-4 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            onClick={() => onHymnSelect(hymn)}
          >
            <div className="flex items-start gap-4">
              <div className="text-xl font-bold text-blue-600 w-16">
                #{hymn.hymnTitleNumber}
              </div>
              <div>
                <div className="font-semibold text-slate-800">
                  {hymn.lyrics.verses?.[0]?.[0]?.text || 'Untitled Hymn'}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {hymn.lyrics.verses?.length || 0} verses • {hymn.lyrics.choruses?.length || 0} choruses
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Music className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HymnLyricsList;
