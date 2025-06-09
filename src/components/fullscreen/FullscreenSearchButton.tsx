
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FullscreenSearchButtonProps {
  onOpenSearch: () => void;
}

const FullscreenSearchButton = ({ onOpenSearch }: FullscreenSearchButtonProps) => {
  return (
    <Button
      onClick={onOpenSearch}
      variant="outline"
      size="sm"
      className="fixed bottom-6 right-6 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12 p-0 rounded-full"
    >
      <Search className="w-5 h-5" />
    </Button>
  );
};

export default FullscreenSearchButton;
