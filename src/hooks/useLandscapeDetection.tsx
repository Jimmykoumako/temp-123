
import { useState, useEffect } from 'react';

export const useLandscapeDetection = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);
    };

    // Check on mount
    checkOrientation();

    // Add event listeners
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return isLandscape;
};
