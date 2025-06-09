
import { Button } from "@/components/ui/button";
import { Music, X, ChevronUp, ChevronDown } from "lucide-react";

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

interface FullscreenHymnBufferProps {
  hymnBuffer: Hymn[];
  currentBufferIndex: number;
  onSelectHymn: (hymn: Hymn) => void;
  onRemoveFromBuffer: (hymnId: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const FullscreenHymnBuffer = ({
  hymnBuffer,
  currentBufferIndex,
  onSelectHymn,
  onRemoveFromBuffer,
  isVisible,
  onToggleVisibility
}: FullscreenHymnBufferProps) => {
  if (hymnBuffer.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggleVisibility}
        variant="outline"
        size="sm"
        className="fixed top-6 right-20 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Music className="w-4 h-4 mr-2" />
        Buffer ({hymnBuffer.length})
        {isVisible ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      {/* Buffer List */}
      {isVisible && (
        <div className="fixed top-20 right-6 w-80 max-h-96 pointer-events-auto bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <div className="p-3 border-b border-white/20">
            <h3 className="text-white font-semibold">Hymn Buffer</h3>
            <p className="text-slate-400 text-sm">{hymnBuffer.length} hymns ready</p>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {hymnBuffer.map((hymn, index) => (
              <div
                key={hymn.id}
                className={`flex items-center justify-between p-3 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors ${
                  index === currentBufferIndex ? 'bg-white/20' : ''
                }`}
                onClick={() => onSelectHymn(hymn)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`text-xs font-bold w-8 ${
                    index === currentBufferIndex ? 'text-blue-300' : 'text-slate-400'
                  }`}>
                    #{hymn.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm truncate ${
                      index === currentBufferIndex ? 'text-white' : 'text-slate-300'
                    }`}>
                      {hymn.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {hymn.author}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromBuffer(hymn.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenHymnBuffer;
