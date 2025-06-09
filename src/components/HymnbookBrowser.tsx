import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Book, Users, Music, Eye, ArrowLeft } from "lucide-react";

interface Hymnbook {
  id: number;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  access_level: string;
  added_hymns: number;
}

interface HymnbookBrowserProps {
  onSelectHymnbook: (hymnbook: Hymnbook) => void;
  selectedHymnbook?: Hymnbook;
  onBack: () => void;
}

const HymnbookBrowser = ({ onSelectHymnbook, selectedHymnbook, onBack }: HymnbookBrowserProps) => {
  const [hymnbooks, setHymnbooks] = useState<Hymnbook[]>([]);
  const [filteredHymnbooks, setFilteredHymnbooks] = useState<Hymnbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnbooks();
  }, []);

  const fetchHymnbooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('HymnBook')
        .select('id, name, description, category, is_active, access_level, added_hymns')
        .order('name');

      if (error) throw error;

      setHymnbooks(data || []);
      setFilteredHymnbooks(data || []);
    } catch (error) {
      console.error('Error fetching hymnbooks:', error);
      toast({
        title: "Error",
        description: "Failed to load hymnbooks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHymnbooks = () => {
    let results = hymnbooks;

    if (searchTerm) {
      results = results.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterActive !== null) {
      results = results.filter(book => book.is_active === filterActive);
    }

    setFilteredHymnbooks(results);
  };

  useEffect(() => {
    filterHymnbooks();
  }, [searchTerm, filterActive, hymnbooks]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymnbooks...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">Hymnbook Browser</h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search hymnbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') setFilterActive(null);
                else setFilterActive(value === 'active');
              }}
            >
              <option value="all">All Hymnbooks</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Hymnbook List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHymnbooks.map((hymnbook) => (
            <Card
              key={hymnbook.id}
              className={`p-4 cursor-pointer hover:bg-blue-50 border-2 ${selectedHymnbook?.id === hymnbook.id ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => onSelectHymnbook(hymnbook)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{hymnbook.name}</h3>
                {hymnbook.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </div>
              <p className="text-slate-600 text-sm">{hymnbook.description}</p>
              <div className="text-sm text-slate-500 mt-2">
                Category: {hymnbook.category}
              </div>
            </Card>
          ))}
        </div>

        {filteredHymnbooks.length === 0 && (
          <div className="text-center py-4 text-slate-500">
            No hymnbooks found matching your criteria.
          </div>
        )}
      </Card>
    </div>
  );
};

export default HymnbookBrowser;
