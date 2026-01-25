import { useState, useEffect } from 'react';
import useSounds from '#hooks/useSounds';

const LoginBootSequence = ({ onComplete, username }) => {
  const [bootLines, setBootLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('auth');
const { playLoaderBios, initSounds } = useSounds();

  // Función para generar timestamp realista
  const timestamp = (time) => `[${time.toFixed(6)}]`;

  // Fases del boot
  const phases = {
    auth: { label: 'Autenticación', color: 'bg-green-500' },
    system: { label: 'Cargando Sistema', color: 'bg-blue-500' },
    user: { label: 'Preparando Entorno', color: 'bg-purple-500' },
    final: { label: 'Finalizando', color: 'bg-cyan-500' }
  };

  // Secuencia de login/boot dividida en fases
  const generateLoginSequence = () => {
    let time = 0.012016;
    
    return [
      // FASE 1: Autenticación (0-3)
      { time: time, prefix: 'login:', text: `Authentication successful for user: ${username}`, color: 'text-green-400', phase: 'auth' },
      { time: time += 0.023257, prefix: 'pam:', text: 'Session opened for user by (uid=0)', color: 'text-gray-400', phase: 'auth' },
      { time: time += 0.018890, prefix: 'systemd[1]:', text: `Started User Manager for UID ${Math.floor(Math.random() * 9000 + 1000)}.`, color: 'text-green-400', phase: 'auth' },
      
      // FASE 2: Sistema (4-13)
      { time: time += 0.032757, prefix: 'user:', text: 'Loading user profile...', color: 'text-cyan-400', phase: 'system' },
      { time: time += 0.044619, prefix: 'user:', text: 'Mounting user directories...', color: 'text-cyan-400', phase: 'system' },
      { time: time += 0.029488, prefix: 'fs:', text: 'Mounted /home/user/Desktop', color: 'text-blue-400', phase: 'system' },
      { time: time += 0.022664, prefix: 'fs:', text: 'Mounted /home/user/Documents', color: 'text-blue-400', phase: 'system' },
      { time: time += 0.026810, prefix: 'fs:', text: 'Mounted /home/user/Downloads', color: 'text-blue-400', phase: 'system' },
      { time: time += 0.036743, prefix: 'preferences:', text: 'Loading user settings...', color: 'text-purple-400', phase: 'system' },
      { time: time += 0.027912, prefix: 'preferences:', text: 'Theme applied: dark', color: 'text-purple-400', phase: 'system' },
      { time: time += 0.030817, prefix: 'preferences:', text: 'Wallpaper loaded', color: 'text-purple-400', phase: 'system' },
      { time: time += 0.038043, prefix: 'network:', text: 'Checking network connectivity...', color: 'text-yellow-400', phase: 'system' },
      { time: time += 0.057763, prefix: 'network:', text: 'Network: CONNECTED', color: 'text-green-400', phase: 'system' },
      
      // FASE 3: Entorno de usuario (14-19)
      { time: time += 0.026874, prefix: 'tasks:', text: 'Loading task manager...', color: 'text-cyan-400', phase: 'user' },
      { time: time += 0.045385, prefix: 'tasks:', text: 'Syncing tasks from server...', color: 'text-cyan-400', phase: 'user' },
      { time: time += 0.054789, prefix: 'tasks:', text: 'Tasks synchronized', color: 'text-green-400', phase: 'user' },
      { time: time += 0.038751, prefix: 'ui:', text: 'Initializing desktop environment...', color: 'text-blue-400', phase: 'user' },
      { time: time += 0.043680, prefix: 'ui:', text: 'Loading application dock...', color: 'text-blue-400', phase: 'user' },
      { time: time += 0.036459, prefix: 'ui:', text: 'Starting window manager...', color: 'text-blue-400', phase: 'user' },
      
      // FASE 4: Finalización (20-22)
      { time: time += 0.055998, prefix: 'notification:', text: 'Notification service ready', color: 'text-green-400', phase: 'final' },
      { time: time += 0.034988, prefix: 'systemd[1]:', text: 'Reached target Graphical Interface.', color: 'text-green-400', phase: 'final' },
      { time: time += 0.024876, prefix: 'session:', text: `Welcome back, ${username}!`, color: 'text-cyan-400', phase: 'final' },
      { time: time += 0.012060, prefix: 'kernel:', text: `Login completed in ${time.toFixed(6)}s.`, color: 'text-green-400', phase: 'final' }
    ];
  };

  useEffect(() => {
    const sequence = generateLoginSequence();
    let currentIndex = 0;
    const totalLines = sequence.length;
  playLoaderBios(true);
    const showNextLine = () => {
      if (currentIndex < sequence.length) {
        const line = sequence[currentIndex];
        setBootLines(prev => [...prev, line]);
        
        // Actualizar fase actual
        setCurrentPhase(line.phase);
        
        // Actualizar progreso
        setProgress(((currentIndex + 1) / totalLines) * 100);
        
        currentIndex++;

        // Delay más largo para dar tiempo a leer
        const delay = currentIndex < 5 ? 120 : currentIndex < 15 ? 100 : 110;
        setTimeout(showNextLine, delay);
      } else {
        // Login sequence completado
        playLoaderBios(false);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    showNextLine();
  }, [onComplete, username]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[50000]">
      {/* Contenido del boot */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed">
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

      {/* Barra de progreso inferior */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Etiqueta de fase actual */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono">
              {phases[currentPhase]?.label || 'Iniciando...'}
            </span>
            <span className="text-gray-500 font-mono">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ease-out ${phases[currentPhase]?.color || 'bg-gray-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Indicadores de fases */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {Object.entries(phases).map(([key, phase]) => (
              <div key={key} className="flex items-center gap-1.5 flex-1">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPhase === key 
                    ? phase.color 
                    : bootLines.some(l => l.phase === key)
                    ? 'bg-gray-600'
                    : 'bg-gray-800'
                }`} />
                <span className={`text-[10px] font-mono transition-colors duration-300 ${
                  currentPhase === key 
                    ? 'text-gray-300' 
                    : bootLines.some(l => l.phase === key)
                    ? 'text-gray-600'
                    : 'text-gray-700'
                }`}>
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>
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
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginBootSequence;