// src/routes/Game.jsx

import { useEffect, useState } from 'react';
import { X, Users, MessageCircle, Trophy } from 'lucide-react';

const GamePage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        // Intentar activar fullscreen al cargar
        const enterFullscreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch (err) {
                console.log('Fullscreen requiere interacción del usuario');
            }
        };

        setTimeout(enterFullscreen, 100);

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleClose = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        window.close();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-semibold text-lg flex items-center gap-2">
                        🎮 Dev World - Multiplayer Workspace
                    </h1>
                    {!isFullscreen && (
                        <button
                            onClick={toggleFullscreen}
                            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            Activar Fullscreen (F11)
                        </button>
                    )}
                </div>
                
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Cerrar ventana"
                >
                    <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                </button>
            </div>

            {/* Área del juego */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <div className="text-center space-y-6 max-w-4xl w-full">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl">
                        <span className="text-6xl">🎮</span>
                    </div>
                    
                    <h2 className="text-5xl font-bold text-white">
                        Dev World
                    </h2>
                    
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Espacio de trabajo multiplayer donde desarrolladores pueden verse trabajar en tiempo real, 
                        chatear y colaborar juntos
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
                            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <p className="text-white font-semibold text-lg">Multiplayer</p>
                            <p className="text-sm text-gray-400 mt-2">Ve a otros devs trabajando en tiempo real</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
                            <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <p className="text-white font-semibold text-lg">Chat en vivo</p>
                            <p className="text-sm text-gray-400 mt-2">Conecta y colabora con la comunidad</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
                            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <p className="text-white font-semibold text-lg">Sistema de Logros</p>
                            <p className="text-sm text-gray-400 mt-2">Gana XP y desbloquea recompensas</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center mt-12">
                        <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl">
                            🚀 Comenzar Juego
                        </button>
                        <button 
                            onClick={handleClose}
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl transition-all border-2 border-white/20"
                        >
                            Cerrar
                        </button>
                    </div>

                    <div className="flex gap-6 justify-center mt-8 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                            <kbd className="px-3 py-1 bg-white/10 rounded border border-white/20 font-mono">F11</kbd>
                            Fullscreen
                        </span>
                        <span className="flex items-center gap-2">
                            <kbd className="px-3 py-1 bg-white/10 rounded border border-white/20 font-mono">ESC</kbd>
                            Salir Fullscreen
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-white font-medium">Online</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-white">24 jugadores activos</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Ping: <span className="text-green-400">12ms</span></span>
                        <span>FPS: <span className="text-green-400">60</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;