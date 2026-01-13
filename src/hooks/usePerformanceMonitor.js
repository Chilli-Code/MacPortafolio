// src/hooks/usePerformanceMonitor.js
import { useState, useEffect, useCallback } from 'react';

export const usePerformanceMonitor = () => {
const [showMonitor, setShowMonitor] = useState(() => {
  const saved = localStorage.getItem('showPerformanceMonitor');
  return saved === null ? true : saved === 'true';
});
  // Sincronizar entre componentes en la misma pestaña
  useEffect(() => {
    const handleToggleEvent = (e) => {
      setShowMonitor(e.detail.show);
    };

    window.addEventListener('performanceMonitorToggle', handleToggleEvent);
    
    return () => {
      window.removeEventListener('performanceMonitorToggle', handleToggleEvent);
    };
  }, []);

  // Sincronizar entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'showPerformanceMonitor') {
        setShowMonitor(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMonitor = useCallback((value) => {
    const newValue = value !== undefined ? value : !showMonitor;
    setShowMonitor(newValue);
    localStorage.setItem('showPerformanceMonitor', newValue.toString());
    
    // Notificar a otros componentes en la misma pestaña
    window.dispatchEvent(new CustomEvent('performanceMonitorToggle', {
      detail: { show: newValue }
    }));
  }, [showMonitor]);

  return { showMonitor, toggleMonitor };
};