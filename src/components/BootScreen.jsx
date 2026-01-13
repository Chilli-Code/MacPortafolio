import { useState, useRef, useEffect } from 'react';
import { Power } from '#assets/icons';
import gsap from 'gsap';

const BootScreen = ({ onBootComplete }) => {
  const [isBooting, setIsBooting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  const handlePowerOn = () => {
    setIsBooting(true);
    setShowLogo(true);
  };

  useEffect(() => {
    if (!showLogo) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onBootComplete, 500);
      }
    });

    // Animación del logo
    tl.fromTo(logoRef.current,
      {
        scale: 0,
        opacity: 0,
        rotation: -180
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }
    )
    // Animación del texto
    .fromTo(textRef.current,
      {
        y: 50,
        opacity: 0,
        letterSpacing: "0.5em"
      },
      {
        y: 0,
        opacity: 1,
        letterSpacing: "0.3em",
        duration: 0.8,
        ease: "power3.out"
      },
      "-=0.4"
    )
    // Pulso suave del logo
    .to(logoRef.current,
      {
        scale: 1.05,
        duration: 0.8,
        yoyo: true,
        repeat: 2,
        ease: "sine.inOut"
      },
      "-=0.4"
    )
    // Fade out completo
    .to(containerRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      },
      "+=0.5"
    );

  }, [showLogo, onBootComplete]);

  if (showLogo) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[50000] gap-12"
      >
        {/* Logo */}
        <div ref={logoRef} className="relative">
          {/* Glow effect detrás del logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-3xl blur-3xl scale-150" />
          
          {/* Logo principal */}
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
            <svg 
              viewBox="0 0 24 24" 
              className="w-20 h-20 text-white drop-shadow-lg"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
        </div>

        {/* Texto Keku Enterprise */}
        <div 
          ref={textRef}
          className="text-white text-4xl font-light tracking-[0.3em] uppercase"
        >
          Keku Enterprise
        </div>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[50000]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-white/50 text-sm font-light tracking-wider">
            Iniciando sistema...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center z-[50000]">
      {/* Efectos de luz de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Botón de encendido */}
      <button 
        onClick={handlePowerOn}
        className="group relative flex flex-col items-center gap-8 cursor-pointer outline-none z-10"
      >
        {/* Círculo del botón */}
        <div className="relative">
          {/* Glow effect exterior */}
          <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl scale-150 group-hover:bg-white/10 group-hover:scale-[2] transition-all duration-700" />
          
          {/* Anillo exterior animado */}
          <div className="absolute inset-0 rounded-full border border-white/10 scale-100 group-hover:scale-[1.3] group-hover:border-white/20 transition-all duration-500" />
          
          {/* Botón principal */}
          <div className="relative w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-500">
            <Power className="w-12 h-12 text-white/40 group-hover:text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-white/60 text-lg tracking-[0.3em] uppercase font-light group-hover:text-white/90 transition-colors duration-500">
            Initialize System
          </span>
          <span className="text-white/20 text-xs tracking-[0.4em] uppercase animate-pulse group-hover:text-white/40 transition-colors duration-500">
            Press to start
          </span>
        </div>
      </button>

      {/* Grid de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Versión del sistema */}
      <div className="absolute bottom-8 text-white/10 text-xs tracking-[0.3em] font-light uppercase">
        Keku Enterprise v1.0.0
      </div>
    </div>
  );
};

export default BootScreen;