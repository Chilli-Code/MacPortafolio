// src/components/LockScreen.jsx
import React, { useState, useEffect } from "react";
import { User, ArrowRight } from "#assets/icons";
import { useAuthStore } from "#store/authStore";
import useSounds from "#hooks/useSounds";

const LockScreen = ({ onLoginSuccess }) => {
  const login = useAuthStore(state => state.login);
  const { initSounds, playHover } = useSounds();

  // Inicializar sonidos
  useEffect(() => {
    initSounds();
  }, [initSounds]);

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(false);
  setErrorMessage("");

  if (!username.trim() || !password.trim()) {
    setError(true);
    setErrorMessage("Por favor completa todos los campos");
    setIsShaking(true);
    setIsLoading(false);
    setTimeout(() => setIsShaking(false), 500);
    return;
  }

  const result = await login(username, password);

  if (result.success) {
    console.log('✅ Login exitoso:', result.user.username);
    // 👇 AGREGAR ESTA LÍNEA
    sessionStorage.setItem('justLoggedIn', 'true');
    onLoginSuccess();
  } else {
    setError(true);
    setErrorMessage(result.error || "Usuario o contraseña incorrectos");
    setIsShaking(true);
    setIsLoading(false);

    setTimeout(() => {
      setIsShaking(false);
      setError(false);
    }, 2000);
  }
};

  // ⭐ Quick login para desarrollo
  const quickLogin = (type) => {
    const credentials = {
      user: { username: 'jorge_dev', password: '123456' },
      admin: { username: 'admin', password: 'admin123' }
    };
    
    const cred = credentials[type];
    setUsername(cred.username);
    setPassword(cred.password);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/wallpapers/wallpaper.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-500/20 to-blue-900/20" />
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

        {/* Avatar + Form */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-2xl ring-4 ring-white/20">
            <User className="w-16 h-16 text-white" />
          </div>

          <h2 className="text-2xl font-medium text-white mb-2 drop-shadow-lg">
            Iniciar Sesión
          </h2>

          {error && errorMessage && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 backdrop-blur-xl">
              <p className="text-red-200 text-sm text-center drop-shadow-md">
                {errorMessage}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-80 items-center mb-4"
          >
            <div className={`relative w-full ${isShaking ? "animate-shake" : ""}`}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario o Email"
                disabled={isLoading}
                onMouseEnter={() => playHover()}
                className={`w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border-2 ${
                  error
                    ? "border-red-500"
                    : "border-white/30 focus:border-white/50"
                } text-white placeholder-white/60 focus:outline-none transition-all text-center shadow-lg disabled:opacity-50`}
                autoFocus
              />
            </div>

            <div className={`relative w-full ${isShaking ? "animate-shake" : ""}`}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                disabled={isLoading}
                onMouseEnter={() => playHover()}
                className={`w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border-2 ${
                  error
                    ? "border-red-500"
                    : "border-white/30 focus:border-white/50"
                } text-white placeholder-white/60 focus:outline-none transition-all text-center shadow-lg disabled:opacity-50`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => playHover()}
              className="relative w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          <p className="text-sm text-white/60 drop-shadow-md mb-4">
            Presiona Enter o haz clic en la flecha
          </p>

          {/* ⭐ Botones de acceso rápido (solo para desarrollo) */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => quickLogin('user')}
              onMouseEnter={() => playHover()}
              className="px-4 py-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-xl text-white/80 hover:text-white text-xs transition-all shadow-lg border border-white/20"
            >
              Demo Usuario
            </button>
            <button
              onClick={() => quickLogin('admin')}
              onMouseEnter={() => playHover()}
              className="px-4 py-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-xl text-white/80 hover:text-white text-xs transition-all shadow-lg border border-white/20"
            >
              Demo Admin
            </button>
          </div>

          {/* ⭐ Credenciales de prueba */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10">
            <p className="text-xs text-white/60 text-center mb-2">Credenciales de prueba:</p>
            <p className="text-xs text-white/80 text-center">
              <strong>Usuario:</strong> jorge_dev / 123456
            </p>
            <p className="text-xs text-white/80 text-center">
              <strong>Admin:</strong> admin / admin123
            </p>
          </div>
        </div>

        {/* Opciones inferiores */}
        <div className="relative mt-16 flex gap-16">
          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Apagar</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Reiniciar</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span className="text-sm drop-shadow-md">Reposo</span>
          </button>
        </div>
      </div>

      {/* Animación shake */}
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