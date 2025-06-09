
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FullscreenFontControlsProps {
  fontSize: number;
  maxFontSize: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
}

const FullscreenFontControls = ({
  fontSize,
  maxFontSize,
  onIncreaseFontSize,
  onDecreaseFontSize
}: FullscreenFontControlsProps) => {
  return (
    <div className="fixed top-6 left-6 flex flex-col gap-2 z-50">
      <Button
        onClick={onIncreaseFontSize}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
        disabled={fontSize >= maxFontSize - 1}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        onClick={onDecreaseFontSize}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
        disabled={fontSize <= 0}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FullscreenFontControls;
