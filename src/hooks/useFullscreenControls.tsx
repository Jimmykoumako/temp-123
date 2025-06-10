
import { useState, useEffect } from "react";

export const useFullscreenControls = () => {
  const [showControls, setShowControls] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const resetTimers = () => {
      setIsIdle(false);
      setShowControls(true);
      
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 2000);
      
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleActivity = () => {
      resetTimers();
    };

    resetTimers();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  return { showControls, isIdle };
};
