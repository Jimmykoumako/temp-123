
import { Button } from "@/components/ui/button";
import { X, Maximize, QrCode } from "lucide-react";

interface FullscreenTopControlsProps {
  onExit: () => void;
  onShowQR?: () => void;
  showQRButton?: boolean;
}

const FullscreenTopControls = ({ onExit, onShowQR, showQRButton = false }: FullscreenTopControlsProps) => {
  return (
    <div className="fixed top-6 right-6 flex gap-2 z-50">
      {showQRButton && onShowQR && (
        <Button
          onClick={onShowQR}
          variant="outline"
          size="sm"
          className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Show QR
        </Button>
      )}
      <Button
        onClick={onExit}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Maximize className="w-4 h-4 mr-2" />
        Fullscreen Presentation
      </Button>
      <Button
        onClick={onExit}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FullscreenTopControls;
