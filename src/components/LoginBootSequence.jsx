import { useState, useEffect } from 'react';

const LoginBootSequence = ({ onComplete, username }) => {
  const [bootLines, setBootLines] = useState([]);

  // Función para generar timestamp realista
  const timestamp = (time) => `[${time.toFixed(6)}]`;

  // Secuencia de login/boot
  const generateLoginSequence = () => {
    let time = 0.012016;
    
    return [
      { time: time, prefix: 'login:', text: `Authentication successful for user: ${username}`, color: 'text-green-400' },
      { time: time += 0.023257, prefix: 'pam:', text: 'Session opened for user by (uid=0)', color: 'text-gray-400' },
      { time: time += 0.018890, prefix: 'systemd[1]:', text: `Started User Manager for UID ${Math.floor(Math.random() * 9000 + 1000)}.`, color: 'text-green-400' },
      { time: time += 0.032757, prefix: 'user:', text: 'Loading user profile...', color: 'text-cyan-400' },
      { time: time += 0.044619, prefix: 'user:', text: 'Mounting user directories...', color: 'text-cyan-400' },
      { time: time += 0.029488, prefix: 'fs:', text: 'Mounted /home/user/Desktop', color: 'text-blue-400' },
      { time: time += 0.022664, prefix: 'fs:', text: 'Mounted /home/user/Documents', color: 'text-blue-400' },
      { time: time += 0.026810, prefix: 'fs:', text: 'Mounted /home/user/Downloads', color: 'text-blue-400' },
      { time: time += 0.036743, prefix: 'preferences:', text: 'Loading user settings...', color: 'text-purple-400' },
      { time: time += 0.027912, prefix: 'preferences:', text: 'Theme applied: dark', color: 'text-purple-400' },
      { time: time += 0.030817, prefix: 'preferences:', text: 'Wallpaper loaded', color: 'text-purple-400' },
      { time: time += 0.038043, prefix: 'network:', text: 'Checking network connectivity...', color: 'text-yellow-400' },
      { time: time += 0.057763, prefix: 'network:', text: 'Network: CONNECTED', color: 'text-green-400' },
      { time: time += 0.026874, prefix: 'tasks:', text: 'Loading task manager...', color: 'text-cyan-400' },
      { time: time += 0.045385, prefix: 'tasks:', text: 'Syncing tasks from server...', color: 'text-cyan-400' },
      { time: time += 0.054789, prefix: 'tasks:', text: 'Tasks synchronized', color: 'text-green-400' },
      { time: time += 0.038751, prefix: 'ui:', text: 'Initializing desktop environment...', color: 'text-blue-400' },
      { time: time += 0.043680, prefix: 'ui:', text: 'Loading application dock...', color: 'text-blue-400' },
      { time: time += 0.036459, prefix: 'ui:', text: 'Starting window manager...', color: 'text-blue-400' },
      { time: time += 0.055998, prefix: 'notification:', text: 'Notification service ready', color: 'text-green-400' },
      { time: time += 0.034988, prefix: 'systemd[1]:', text: 'Reached target Graphical Interface.', color: 'text-green-400' },
      { time: time += 0.024876, prefix: 'session:', text: `Welcome back, ${username}!`, color: 'text-cyan-400' },
      { time: time += 0.012060, prefix: 'kernel:', text: `Login completed in ${time.toFixed(6)}s.`, color: 'text-green-400' }
    ];
  };

  useEffect(() => {
    const sequence = generateLoginSequence();
    let currentIndex = 0;

    const showNextLine = () => {
      if (currentIndex < sequence.length) {
        const line = sequence[currentIndex];
        setBootLines(prev => [...prev, line]);
        currentIndex++;

        // Delay más rápido que el boot inicial
        const delay = currentIndex < 5 ? 60 : currentIndex < 15 ? 40 : 50;
        setTimeout(showNextLine, delay);
      } else {
        // Login sequence completado
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    };

    showNextLine();
  }, [onComplete, username]);

  return (
    <div className="fixed inset-0 bg-black flex items-start justify-start z-[50000] overflow-y-auto">
      <div className="w-full p-6 font-mono text-xs leading-relaxed">
        {bootLines.map((line, index) => (
          <div
            key={index}
            className={`${line.color} opacity-0 animate-fade-in whitespace-pre-wrap`}
            style={{
              animationDelay: `${index * 0.02}s`,
              animationFillMode: 'forwards'
            }}
          >
            <span className="text-gray-600">{timestamp(line.time)}</span>
            <span className="text-gray-500 ml-2">{line.prefix}</span>
            <span className="ml-2">{line.text}</span>
          </div>
        ))}
        
        {bootLines.length > 0 && (
          <div className="mt-4 text-green-400 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <span className="animate-pulse">▌</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginBootSequence;