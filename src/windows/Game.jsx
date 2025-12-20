// Tu componente Game.jsx

import { WindowControls } from "#components";
import GameWindowWrapper from "#hoc/GameWindowWrapper"; // NUEVO WRAPPER
import { X } from "#assets/icons";
import useWindowStore from "#store/window";

const Game = () => {
    const { closeWindow } = useWindowStore();

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
            {/* Header del juego - compacto */}
            <div className="flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer transition-colors"
                            onClick={() => closeWindow('game')}
                        />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <h1 className="text-white font-semibold text-lg ml-4">
                        🎮 Dev World - Multiplayer Workspace
                    </h1>
                </div>
                
                <button
                    onClick={() => closeWindow('game')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Cerrar (ESC)"
                >
                    <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                </button>
            </div>

            {/* Área del juego */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-6 max-w-2xl">
                    {/* Placeholder del juego */}
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
                        <span className="text-6xl">🎮</span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white">
                        Dev World
                    </h2>
                    
                    <p className="text-xl text-gray-300">
                        Espacio de trabajo multiplayer donde desarrolladores pueden verse trabajar en tiempo real y chatear
                    </p>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-2">👥</div>
                            <p className="text-white font-semibold">Multiplayer</p>
                            <p className="text-sm text-gray-400 mt-1">Ve a otros devs trabajando</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-white font-semibold">Chat en vivo</p>
                            <p className="text-sm text-gray-400 mt-1">Conecta con la comunidad</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-2">🏆</div>
                            <p className="text-white font-semibold">Logros</p>
                            <p className="text-sm text-gray-400 mt-1">Sistema de recompensas</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center mt-8">
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg">
                            Comenzar Juego
                        </button>
                        <button 
                            onClick={() => closeWindow('game')}
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
                        >
                            Volver al escritorio
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Presiona <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">ESC</kbd> para salir
                    </p>
                </div>
            </div>

            {/* Footer opcional con info */}
            <div className="px-6 py-3 bg-black/30 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Online
                        </span>
                        <span>👥 24 jugadores conectados</span>
                    </div>
                    <div>
                        <span>FPS: 60</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GameWindow = GameWindowWrapper(Game, 'game');

export default GameWindow;