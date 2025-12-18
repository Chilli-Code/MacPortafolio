// src/components/Dock.jsx

import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { dockApps } from "#constants/index.js";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window.js";

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);
    const gameWindowRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");
        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                });
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(e.clientX - left);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1, y: 0, duration: 0.3, ease: "power1.out",
        }));

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }
    }, []);

    const openGamePopup = () => {
        // Cerrar ventana anterior si existe
        if (gameWindowRef.current && !gameWindowRef.current.closed) {
            gameWindowRef.current.close();
        }

        // Obtener dimensiones de la pantalla
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;

        // Características de la ventana popup
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

        // Obtener la URL base correcta
        const baseUrl = window.location.origin;
        
        // Abrir nueva ventana en la ruta /game
        gameWindowRef.current = window.open(
            `${baseUrl}/game`,
            'DevWorldGame',
            features
        );

        // Detectar cuando se cierra la ventana
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

        // Para otras apps, comportamiento normal
        const window = windows[app.id];

        if (window.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }
    };

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex justify-center">
                        <button
                            type="button"
                            className="dock-icon"
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                draggable={false}
                                src={`/images/${icon}`}
                                alt={name}
                                className={canOpen ? "" : "opacity-60"}
                            />
                            {id !== 'game' && windows[id]?.isOpen && (
                                <span className="mt-1 w-2 h-2 absolute left-6 top-12 bg-white rounded-full animate-pulse"></span>
                            )}
                        </button>
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place="top" className="tooltip"></Tooltip>
            </div>
        </section>
    );
};

export default Dock;