
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HymnSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const HymnSearchBar = ({ searchTerm, onSearchChange }: HymnSearchBarProps) => {
  return (
    <Card className="p-6 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by hymn number or lyrics..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </Card>
  );
};

export default HymnSearchBar;
