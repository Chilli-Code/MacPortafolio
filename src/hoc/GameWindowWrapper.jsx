// /hoc/GameWindowWrapper.jsx

import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";

const GameWindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { windows, closeWindow } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        // Animación de apertura fullscreen
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            gsap.fromTo(
                el,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }
            );
        }, [isOpen]);

        // Cerrar con tecla ESC
        useLayoutEffect(() => {
            if (!isOpen) return;

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    closeWindow(windowKey);
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, [isOpen, closeWindow, windowKey]);

        // Manejar apertura/cierre
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.visibility = isOpen ? "visible" : "hidden";
            el.style.pointerEvents = isOpen ? "auto" : "none";
        }, [isOpen]);

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={clsx(
                    "fixed inset-0 w-full h-full",
                    "bg-gray-900" // Fondo oscuro para el juego
                )}
            >
                <Component {...props} />
            </section>
        );
    };

    wrapped.displayName = `GameWindowWrapper(${Component.displayName || Component.name || "Component"})`;

    return wrapped;
};

export default GameWindowWrapper;