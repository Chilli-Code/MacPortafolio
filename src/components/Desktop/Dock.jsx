// src/components/Dock.jsx
import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { dockApps } from "#constants/index.js";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window.js";
// ✅ BIEN
import { useAppSettingsStore } from "#store/appSettingsStore";


const Dock = () => {
    const { openWindow, closeWindow, restoreWindow, windows } = useWindowStore(); // ⭐ Agregar restoreWindow
    const dockRef = useRef(null);
    const gameWindowRef = useRef(null);
    
    const { dockPosition } = useAppSettingsStore(); // 🆕 Obtener posición del store centralizado


    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");
        const isVertical = dockPosition === 'left' || dockPosition === 'right';
        
        const animateIcons = (mousePos) => {
            const rect = dock.getBoundingClientRect();
            const dockStart = isVertical ? rect.top : rect.left;

            icons.forEach((icon) => {
                const iconRect = icon.getBoundingClientRect();
                const iconStart = isVertical ? iconRect.top : iconRect.left;
                const iconSize = isVertical ? iconRect.height : iconRect.width;
                const center = iconStart - dockStart + iconSize / 2;
                const distance = Math.abs(mousePos - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    [isVertical ? 'x' : 'y']: (isVertical ? 15 : -15) * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                });
            });
        };

        const handleMouseMove = (e) => {
            const rect = dock.getBoundingClientRect();
            const mousePos = isVertical 
                ? e.clientY - rect.top 
                : e.clientX - rect.left;
            animateIcons(mousePos);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1, x: 0, y: 0, duration: 0.3, ease: "power1.out",
        }));

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }
    }, [dockPosition]); 

    const openGamePopup = () => {
        if (gameWindowRef.current && !gameWindowRef.current.closed) {
            gameWindowRef.current.close();
        }

        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;

        const features = [
            `width=${screenWidth}`,
            `height=${screenHeight}`,
            'left=0',
            'top=0',
            'menubar=no',
            'toolbar=no',
            'location=no',
            'status=no',
            'resizable=yes',
            'scrollbars=no'
        ].join(',');

        const baseUrl = window.location.origin;

        gameWindowRef.current = window.open(
            `${baseUrl}/game`,
            'DevWorldGame',
            features
        );

        if (gameWindowRef.current) {
            const checkClosed = setInterval(() => {
                if (gameWindowRef.current.closed) {
                    clearInterval(checkClosed);
                    gameWindowRef.current = null;
                }
            }, 1000);
        }
    };

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        // Si es el juego, abrir popup
        if (app.id === 'game') {
            openGamePopup();
            return;
        }

        // ⭐ LÓGICA ACTUALIZADA con minimizar
        const window = windows[app.id];

        if (!window) {
            // Si la ventana no existe en el config, abrirla
            openWindow(app.id);
            return;
        }

        const { isOpen, isMinimized } = window;

        if (isOpen && isMinimized) {
            // ⭐ Si está minimizada, restaurarla
            restoreWindow(app.id);
        } else if (isOpen && !isMinimized) {
            // ⭐ Si está abierta y visible, minimizarla (opcional: o cerrarla)
            // Opción 1: Minimizar
            // minimizeWindow(app.id);

            // Opción 2: Cerrar (comportamiento clásico macOS)
            closeWindow(app.id);
        } else {
            // Si está cerrada, abrirla
            openWindow(app.id);
        }
    };

    return (
        <section id="dock" data-position={dockPosition} >
            <div ref={dockRef} className="dock-container">
                {dockApps.map(({ id, name, icon, canOpen }) => {
                    const window = windows[id];
                    const isOpen = window?.isOpen;
                    const isMinimized = window?.isMinimized;

                    return (
                        <div key={id} className="relative flex justify-center">
                            <button
                                type="button"
                                className="dock-icon"
                                aria-label={name}
                                data-tooltip-id="dock-tooltip"
                                data-tooltip-content={
                                    isMinimized
                                        ? `${name} (minimizada)`
                                        : name
                                }
                                data-tooltip-delay-show={150}
                                disabled={!canOpen}
                                onClick={() => toggleApp({ id, canOpen })}
                            >
                                <img
                                    draggable={false}
                                    src={`/images/${icon}`}
                                    alt={name}
                                    width={60}
                                    height={60}
                                    className={canOpen ? "" : "opacity-60"}
                                />


                                {/* ⭐ INDICADOR MEJORADO */}
                                {id !== 'game' && isOpen && (
                                    <span
                                        className={`
                                            mt-1 w-2 h-2 absolute left-1/2 -translate-x-1/2 -bottom-1 rounded-full 
                                            ${isMinimized
                                                ? 'bg-yellow-500 animate-pulse' // ⭐ Amarillo si minimizada
                                                : 'bg-white' // Blanco si visible
                                            }
                                        `}
                                    />
                                )}
                            </button>
                        </div>
                    );
                })}
                <Tooltip id="dock-tooltip" place="top" className="tooltip"></Tooltip>
            </div>
        </section>
    );
};

export default Dock;