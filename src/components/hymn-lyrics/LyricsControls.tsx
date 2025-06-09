
import { Button } from "@/components/ui/button";

interface LyricsControlsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
}

const LyricsControls = ({ currentSection, totalSections, onPrevious, onNext }: LyricsControlsProps) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4">
        <Button 
          onClick={onPrevious} 
          disabled={currentSection === 0} 
          size="sm"
        >
          Previous
        </Button>
        <span className="text-sm text-slate-600">
          Section {currentSection + 1} of {totalSections}
        </span>
        <Button 
          onClick={onNext} 
          disabled={currentSection === totalSections - 1} 
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LyricsControls;
