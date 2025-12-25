// src/components/LoadingScreen.jsx
import { useEffect, useState } from 'react';

const LoadingScreen = ({ message = "Cargando...", showProgress = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center backdrop-blur-sm">
      {/* Blur Background Effect */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* macOS Style Spinner */}
        <div className="relative">
          {/* Outer ring - subtle glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl animate-pulse" />
          
          {/* Main spinner */}
          <div className="relative w-16 h-16">
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" 
                 style={{ 
                   animationDuration: '1s',
                   animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                 }} 
            />
            
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-md" />
          </div>
        </div>

        {/* Loading Text - iOS style */}
        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200 tracking-tight">
            {message}
          </p>
          
          {/* Progress Bar - macOS style */}
          {showProgress && (
            <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {/* Dots animation - subtle */}
          <div className="flex items-center justify-center gap-1.5 h-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Optional: App Icon */}
        <div className="absolute -top-32 opacity-20 dark:opacity-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl" />
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
    </div>
  );
};

export default LoadingScreen;