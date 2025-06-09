
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { hymns } from "@/data/hymns";

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

interface FullscreenHymnSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBuffer: (hymn: Hymn) => void;
  bufferHymnIds: string[];
}

const FullscreenHymnSearch = ({ 
  isOpen, 
  onClose, 
  onAddToBuffer,
  bufferHymnIds 
}: FullscreenHymnSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHymns, setFilteredHymns] = useState<Hymn[]>([]);

  // Convert static hymns data to match our Hymn interface
  const convertedHymns: Hymn[] = hymns.map(hymn => ({
    id: hymn.id.toString(),
    number: hymn.number.toString(),
    title: hymn.title,
    author: hymn.author,
    verses: hymn.verses,
    chorus: hymn.chorus,
    key: hymn.key,
    tempo: hymn.tempo
  }));

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHymns(convertedHymns.slice(0, 20)); // Show first 20 hymns when no search
    } else {
      const filtered = convertedHymns.filter(hymn =>
        hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hymn.number.includes(searchTerm) ||
        hymn.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHymns(filtered.slice(0, 50)); // Limit to 50 results
    }
  }, [searchTerm]);

  const handleAddToBuffer = (hymn: Hymn) => {
    onAddToBuffer(hymn);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Search Hymns</DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by hymn number, title, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredHymns.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No hymns found matching your search
              </div>
            ) : (
              filteredHymns.map((hymn) => {
                const isInBuffer = bufferHymnIds.includes(hymn.id);
                return (
                  <div
                    key={hymn.id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-blue-400 font-bold w-12 text-sm">
                        #{hymn.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {hymn.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {hymn.author}
                        </p>
                        <p className="text-xs text-slate-500">
                          {hymn.verses.length} verses • {hymn.key} • {hymn.tempo} BPM
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToBuffer(hymn)}
                      variant={isInBuffer ? "secondary" : "outline"}
                      size="sm"
                      disabled={isInBuffer}
                      className={isInBuffer 
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {isInBuffer ? "Added" : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenHymnSearch;
