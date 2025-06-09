
import { Button } from "@/components/ui/button";
import { Focus, Eye } from "lucide-react";

interface LyricsFocusButtonProps {
  isLyricsOnly: boolean;
  onToggle: () => void;
}

const LyricsFocusButton = ({ isLyricsOnly, onToggle }: LyricsFocusButtonProps) => {
  return (
    <div className="flex justify-center mb-6">
      <Button 
        onClick={onToggle}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isLyricsOnly ? <Eye className="w-4 h-4" /> : <Focus className="w-4 h-4" />}
        {isLyricsOnly ? 'Show Full View' : 'Focus on Lyrics'}
      </Button>
    </div>
  );
};

export default LyricsFocusButton;
