
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenButtonProps {
  className?: string;
}

const FullscreenButton = ({ className = "" }: FullscreenButtonProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <Button 
      onClick={toggleFullscreen} 
      variant="outline" 
      size="sm"
      className={className}
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize className="w-4 h-4 mr-2" />
          Fullscreen
        </>
      )}
    </Button>
  );
};

export default FullscreenButton;
