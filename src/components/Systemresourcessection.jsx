import { useState, useEffect } from 'react';
import { Activity, HardDrive, Wifi, Battery, Clock, Zap } from '#assets/icons';

const SystemResourcesSection = () => {
  const [metrics, setMetrics] = useState({
    // ✅ REAL: FPS del navegador
    fps: 0,
    
    // ✅ REAL: Memoria JS del navegador (Chrome/Edge)
    memoryUsedMB: 0,
    memoryLimitMB: 0,
    memoryPercentage: 0,
    
    // ✅ REAL: Latencia de red
    networkLatency: 0,
    connectionQuality: 'midiendo',
    isOnline: true,
    
    // ✅ REAL: Batería (si está disponible)
    batteryLevel: null,
    isCharging: false,
    
    // ✅ REAL: Tiempo de carga de la app
    loadTime: 0,
    
    // ✅ REAL: Tareas activas (ejemplo: tareas pendientes en tu app)
    activeTasks: 0,
    
    // ✅ REAL: Conexión (tipo de red)
    connectionType: 'unknown',
    effectiveType: 'unknown'
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;
    let lastNetworkCheck = 0;

    // ✅ REAL: Tiempo de carga de la página
    const loadTime = performance.timing 
      ? (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000
      : 0;
    
    setMetrics(prev => ({ ...prev, loadTime: loadTime.toFixed(2) }));

    // ✅ REAL: Tipo de conexión (si está disponible)
    if ('connection' in navigator) {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        setMetrics(prev => ({
          ...prev,
          connectionType: conn.type || 'unknown',
          effectiveType: conn.effectiveType || 'unknown'
        }));
        
        // Actualizar cuando cambie la conexión
        conn.addEventListener('change', () => {
          setMetrics(prev => ({
            ...prev,
            connectionType: conn.type || 'unknown',
            effectiveType: conn.effectiveType || 'unknown'
          }));
        });
      }
    }

    const updateMetrics = () => {
      const newMetrics = {};

      // ✅ REAL: Memoria JS (solo en Chrome/Edge)
      if (performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / 1048576;
        const limitMB = performance.memory.jsHeapSizeLimit / 1048576;
        newMetrics.memoryUsedMB = usedMB;
        newMetrics.memoryLimitMB = limitMB;
        newMetrics.memoryPercentage = (usedMB / limitMB) * 100;
      }

      // ✅ REAL: Latencia de red (ping real)
      const now = performance.now();
      if (now - lastNetworkCheck > 5000) {
        lastNetworkCheck = now;
        const startTime = performance.now();
        
        // Ping a un recurso pequeño de tu servidor o CDN
        fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-store'
        })
          .then(() => {
            const latency = performance.now() - startTime;
            let quality = 'excelente';
            if (latency > 300) quality = 'pobre';
            else if (latency > 150) quality = 'regular';
            else if (latency > 80) quality = 'bueno';
            
            setMetrics(prev => ({
              ...prev,
              networkLatency: Math.round(latency),
              connectionQuality: quality
            }));
          })
          .catch(() => {
            setMetrics(prev => ({
              ...prev,
              networkLatency: 0,
              connectionQuality: 'offline'
            }));
          });
      }

      // ✅ REAL: Estado online/offline
      newMetrics.isOnline = navigator.onLine;

      // ✅ REAL: Batería
      if ('getBattery' in navigator) {
        navigator.getBattery?.().then(battery => {
          setMetrics(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            isCharging: battery.charging
          }));
        });
      }

      setMetrics(prev => ({ ...prev, ...newMetrics }));
    };

    // ✅ REAL: Monitor de FPS
    const measureFPS = (currentTime) => {
      frameCount++;
      const elapsed = currentTime - lastTime;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
        updateMetrics();
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Listeners para cambios de red
    window.addEventListener('online', () => setMetrics(prev => ({ ...prev, isOnline: true })));
    window.addEventListener('offline', () => setMetrics(prev => ({ ...prev, isOnline: false })));

    updateMetrics();
    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);

  const CompactMetric = ({ icon: Icon, label, value, unit, color, progress, hideProgress }) => (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-md ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none mb-0.5">
          {label}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
            {value}{unit}
          </span>
          {!hideProgress && progress !== undefined && (
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progress > 80 ? 'bg-red-500' :
                  progress > 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
            Monitoreo
          </span>
          <div className="ml-auto flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${
              metrics.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-[10px] text-gray-400">
              {metrics.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas REALES */}
      <div className="p-3 space-y-2.5">
        {/* ✅ FPS Real */}
        <CompactMetric
          icon={Activity}
          label="Rendimiento"
          value={metrics.fps}
          unit=" FPS"
          color={`${
            metrics.fps >= 55 ? 'bg-green-100 dark:bg-green-900/30' :
            metrics.fps >= 30 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-red-100 dark:bg-red-900/30'
          }`}
          progress={(metrics.fps / 60) * 100}
        />

        {/* ✅ Memoria Real (solo Chrome/Edge) */}
        {performance.memory && (
          <CompactMetric
            icon={HardDrive}
            label="Memoria JS"
            value={metrics.memoryUsedMB.toFixed(0)}
            unit=" MB"
            color="bg-blue-100 dark:bg-blue-900/30"
            progress={metrics.memoryPercentage}
          />
        )}

        {/* ✅ Latencia Real */}
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
            metrics.connectionQuality === 'excelente' ? 'bg-green-100 dark:bg-green-900/30' :
            metrics.connectionQuality === 'bueno' ? 'bg-blue-100 dark:bg-blue-900/30' :
            metrics.connectionQuality === 'regular' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            metrics.connectionQuality === 'pobre' ? 'bg-red-100 dark:bg-red-900/30' :
            'bg-gray-100 dark:bg-gray-900/30'
          }`}>
            <Wifi className={`w-3.5 h-3.5 ${
              metrics.connectionQuality === 'excelente' ? 'text-green-600 dark:text-green-400' :
              metrics.connectionQuality === 'bueno' ? 'text-blue-600 dark:text-blue-400' :
              metrics.connectionQuality === 'regular' ? 'text-yellow-600 dark:text-yellow-400' :
              metrics.connectionQuality === 'pobre' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`} />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none mb-0.5">
              Latencia
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                {metrics.networkLatency > 0 
                  ? `${metrics.networkLatency}ms` 
                  : 'Midiendo...'}
              </span>
              {metrics.effectiveType !== 'unknown' && (
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                  {metrics.effectiveType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Tiempo de carga Real */}
        {metrics.loadTime > 0 && (
          <CompactMetric
            icon={Clock}
            label="Tiempo de Carga"
            value={metrics.loadTime}
            unit="s"
            color={`${
              metrics.loadTime < 2 ? 'bg-green-100 dark:bg-green-900/30' :
              metrics.loadTime < 5 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              'bg-red-100 dark:bg-red-900/30'
            }`}
            hideProgress={true}
          />
        )}

        {/* ✅ Batería Real (si está disponible) */}
        {metrics.batteryLevel !== null && (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
              metrics.batteryLevel > 60 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
              metrics.batteryLevel > 20 ? 'bg-amber-100 dark:bg-amber-900/30' :
              'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Battery className={`w-3.5 h-3.5 ${
                metrics.batteryLevel > 60 ? 'text-emerald-600 dark:text-emerald-400' :
                metrics.batteryLevel > 20 ? 'text-amber-600 dark:text-amber-400' :
                'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none mb-0.5">
                Batería
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                  {metrics.batteryLevel}%
                </span>
                {metrics.isCharging && (
                  <Zap className="w-3 h-3 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con metadata */}
      <div className="px-3 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
          Métricas en tiempo real • Actualización continua
        </div>
      </div>
    </div>
  );
};

export default SystemResourcesSection;