import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Settings, LogOut, Maximize2 } from '#assets/icons';

const GamePage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);

    useEffect(() => {
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

    const menuButtons = [
        { id: 'play', label: 'JUGAR', color: 'from-green-600 to-green-700', hoverColor: 'from-green-500 to-green-600' },
        { id: 'tasks', label: 'MIS TAREAS', color: 'from-blue-600 to-blue-700', hoverColor: 'from-blue-500 to-blue-600' },
        { id: 'social', label: 'SALA SOCIAL', color: 'from-purple-600 to-purple-700', hoverColor: 'from-purple-500 to-purple-600' },
        { id: 'achievements', label: 'LOGROS', color: 'from-yellow-600 to-yellow-700', hoverColor: 'from-yellow-500 to-yellow-600' },
        { id: 'settings', label: 'OPCIONES', color: 'from-gray-600 to-gray-700', hoverColor: 'from-gray-500 to-gray-600' },
        { id: 'quit', label: 'SALIR', color: 'from-red-600 to-red-700', hoverColor: 'from-red-500 to-red-600' },
    ];

    return (
        <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
            {/* Animated pixelated background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px),
                        repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)
                    `
                }} />
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                            opacity: Math.random() * 0.5 + 0.2
                        }}
                    />
                ))}
            </div>

            {/* Top bar with controls */}
            <div className="relative z-50 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm border-b-4 border-slate-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-white/10 rounded transition-all"
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-red-400" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-green-400" />
                        )}
                    </button>
                    
                    {!isFullscreen && (
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-white/10 rounded transition-all"
                        >
                            <Maximize2 className="w-5 h-5 text-cyan-400" />
                        </button>
                    )}
                </div>

                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-red-500/20 rounded transition-all group"
                >
                    <X className="w-5 h-5 text-white/70 group-hover:text-red-400" />
                </button>
            </div>

            {/* Main menu content */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl space-y-8">
                    {/* Logo/Title */}
                    <div className="text-center space-y-4 mb-12">
                        <div className="relative inline-block">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-2xl opacity-50 animate-pulse" />
                            
                            {/* Main title */}
                            <h1 className="relative text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl" style={{
                                textShadow: '4px 4px 0 rgba(0,0,0,0.5), 8px 8px 0 rgba(0,0,0,0.2)',
                                fontFamily: '"Press Start 2P", monospace'
                            }}>
                                DEV
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                                    WORLD
                                </span>
                            </h1>
                        </div>
                        
                        <p className="text-cyan-400 text-sm md:text-base font-bold tracking-wider" style={{
                            fontFamily: 'monospace',
                            textShadow: '2px 2px 0 rgba(0,0,0,0.5)'
                        }}>
                            [ WORK • PLAY • EARN ]
                        </p>

                        {/* Player stats */}
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border-2 border-green-500/50 rounded">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 font-bold">127 ONLINE</span>
                            </div>
                            <div className="px-3 py-1 bg-black/40 border-2 border-purple-500/50 rounded">
                                <span className="text-purple-400 font-bold">NIVEL 15</span>
                            </div>
                            <div className="px-3 py-1 bg-black/40 border-2 border-yellow-500/50 rounded">
                                <span className="text-yellow-400 font-bold">2,450 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Menu buttons */}
                    <div className="space-y-4">
                        {menuButtons.map((button, index) => (
                            <button
                                key={button.id}
                                onMouseEnter={() => setHoveredButton(button.id)}
                                onMouseLeave={() => setHoveredButton(null)}
                                onClick={() => {
                                    if (button.id === 'quit') {
                                        handleClose();
                                    } else {
                                        console.log(`Clicked: ${button.id}`);
                                    }
                                }}
                                className={`
                                    w-full relative group
                                    transition-all duration-150
                                    ${hoveredButton === button.id ? 'scale-105 translate-x-2' : 'scale-100'}
                                `}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {/* Button shadow */}
                                <div className={`
                                    absolute inset-0 bg-black/60 rounded-lg
                                    ${hoveredButton === button.id ? 'translate-x-1 translate-y-1' : 'translate-x-2 translate-y-2'}
                                    transition-transform duration-150
                                `} />

                                {/* Main button */}
                                <div className={`
                                    relative px-8 py-5 rounded-lg
                                    bg-gradient-to-b ${hoveredButton === button.id ? button.hoverColor : button.color}
                                    border-4 ${hoveredButton === button.id ? 'border-white/40' : 'border-black/40'}
                                    transition-all duration-150
                                `}>
                                    {/* Button highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded" />
                                    
                                    {/* Text */}
                                    <div className="relative flex items-center justify-between">
                                        <span className={`
                                            text-xl md:text-2xl font-black text-white tracking-wider
                                            ${hoveredButton === button.id ? 'translate-x-2' : ''}
                                            transition-transform duration-150
                                        `} style={{
                                            textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
                                            fontFamily: 'monospace'
                                        }}>
                                            {hoveredButton === button.id && '▶ '}
                                            {button.label}
                                        </span>

                                        {/* Badge indicators */}
                                        {button.id === 'tasks' && (
                                            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded border-2 border-black/40 animate-pulse">
                                                5 NEW
                                            </span>
                                        )}
                                        {button.id === 'social' && (
                                            <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded border-2 border-black/40">
                                                24 PLAYERS
                                            </span>
                                        )}
                                    </div>

                                    {/* Scanline effect on hover */}
                                    {hoveredButton === button.id && (
                                        <div className="absolute inset-0 overflow-hidden rounded">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Bottom info */}
                    <div className="text-center space-y-2 mt-8">
                        <div className="flex items-center justify-center gap-4 text-xs text-white/50 font-mono">
                            <span>PRESS [F11] FOR FULLSCREEN</span>
                            <span>•</span>
                            <span>VERSION 1.2.0</span>
                        </div>
                        
                        <p className="text-white/30 text-xs font-mono">
                            © 2025 DEV WORLD - ALL RIGHTS RESERVED
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom status bar */}
            <div className="relative z-10 px-4 py-2 bg-black/60 backdrop-blur-sm border-t-4 border-slate-700">
                <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-4 text-white/60">
                        <span>PING: <span className="text-green-400 font-bold">12ms</span></span>
                        <span>FPS: <span className="text-green-400 font-bold">60</span></span>
                        <span>SERVER: <span className="text-cyan-400 font-bold">US-EAST-1</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                        <span>PLAYER:</span>
                        <span className="text-white font-bold">JORGE_DEV</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-40px) translateX(-10px); }
                    75% { transform: translateY(-20px) translateX(10px); }
                }
                
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-float {
                    animation: float linear infinite;
                }
                
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default GamePage;