// src/hooks/useSafeDevice.js
import { useEffect, useState } from 'react';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

export const useSafeDevice = () => {
  const [device, setDevice] = useState({
    type: 'desktop',
    isRealMobile: false,
    isDesktopResized: false,
    isReady: false
  });

  useEffect(() => {
    // Solo se ejecuta en cliente
    const detect = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Priorizar detección de dispositivo real
      if ((isMobile || isTablet) && hasTouch) {
        const isRealTouchDevice = hasTouch && 
                                 (isMobile || isTablet) && 
                                 /android|iphone|ipad|mobile|tablet/i.test(userAgent);
        
        if (isRealTouchDevice) {
          setDevice({
            type: isMobile ? 'mobile' : 'tablet',
            isRealMobile: true,
            isDesktopResized: false,
            isReady: true
          });
          return;
        }
      }
      
      // Desktop redimensionado
      if (isDesktop && width <= 768 && !hasTouch) {
        setDevice({
          type: 'desktop',
          isRealMobile: false,
          isDesktopResized: true,
          isReady: true
        });
        return;
      }
      
      // Desktop normal
      setDevice({
        type: 'desktop',
        isRealMobile: false,
        isDesktopResized: false,
        isReady: true
      });
    };

    detect();
    
    // Debounced resize
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detect, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return device;
};