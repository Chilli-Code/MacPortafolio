import React, { useState, useEffect } from "react";
import { User, ArrowRight } from "lucide-react";

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isShaking, setIsShaking] = useState(false);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que ambos campos tengan contenido
    if (email.trim() && password.trim()) {
      // Guardar sesión en localStorage
      const userData = {
        email: email,
        loginTime: new Date().toISOString(),
        isLoggedIn: true
      };
      localStorage.setItem('userSession', JSON.stringify(userData));
      
      // Desbloquear
      onUnlock();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setError(false);
      }, 500);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/wallpapers/wallpaper.webp')",
        }}
      />

      {/* Capa de gradiente sobre la imagen */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-500/20 to-blue-900/20" />

      {/* Capa de blur */}
      <div className="absolute inset-0 backdrop-blur-[40px]" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Reloj */}
        <div className="text-center mb-16">
          <h1 className="text-8xl font-light text-white mb-2 drop-shadow-2xl">
            {formatTime(currentTime)}
          </h1>
          <p className="text-2xl font-light text-white/90 capitalize drop-shadow-lg">
            {formatDate(currentTime)}
          </p>
        </div>

        {/* Avatar y formulario */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-2xl ring-4 ring-white/20">
            <User className="w-16 h-16 text-white" />
          </div>

          {/* Nombre de usuario */}
          <h2 className="text-2xl font-medium text-white mb-8 drop-shadow-lg">Solvetic Internet</h2>

          {/* Input de contraseña */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 items-center">
            <div className={`relative w-full ${isShaking ? "animate-shake" : ""}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className={`w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border-2 ${
                  error
                    ? "border-red-500"
                    : "border-white/30 focus:border-white/50"
                } text-white placeholder-white/60 focus:outline-none transition-all text-center shadow-lg`}
                autoFocus
              />
            </div>
            <div className={`relative w-full ${isShaking ? "animate-shake" : ""}`}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={`w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border-2 ${
                  error
                    ? "border-red-500"
                    : "border-white/30 focus:border-white/50"
                } text-white placeholder-white/60 focus:outline-none transition-all text-center shadow-lg`}
              />
            </div>
            <button
              type="submit"
              className="relative w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center transition-all shadow-lg"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Hint */}
          <p className="mt-4 text-sm text-white/60 drop-shadow-md">
            Presiona Enter o haz clic en la flecha
          </p>
        </div>

        {/* Opciones inferiores */}
        <div className="relative mt-20 flex gap-16">
          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Apagar equipo</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Reiniciar</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Reposo</span>
          </button>
        </div>
      </div>

      {/* Estilos para la animación de shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LockScreen;