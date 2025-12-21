// src/hoc/WindowWrapper.jsx
import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";
import { useWindowDrag } from "./useWindowDrag";
import { useWindowResize } from "./useWindowResize";
import { useWindowFocus } from "./useWindowFocus";

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, isMinimized, zIndex } = windows[windowKey]; // ⭐ Agregar isMinimized
        const ref = useRef(null);
        const draggableInstance = useRef(null);
        const [isMaximized, setIsMaximized] = useState(false);
        const [isResizing, setIsResizing] = useState(false);
        const resizeData = useRef({});

        // ⭐ Animación de minimizar/restaurar
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            if (isMinimized) {
                // Animar hacia el dock
                gsap.to(el, {
                    scale: 0.2,
                    opacity: 0,
                    y: window.innerHeight - 100,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        el.style.visibility = 'hidden';
                        el.style.pointerEvents = 'none';
                    }
                });
            } else {
                // Restaurar
                el.style.visibility = 'visible';
                el.style.pointerEvents = 'auto';
                gsap.to(el, {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        }, [isMinimized]);

        // Animación de apertura inicial
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            el.style.display = "none";

            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
            );
        }, [isOpen]);

        // Hooks personalizados
        const dragInstance = useWindowDrag(ref, windowKey, focusWindow);
        if (dragInstance?.instance) {
            draggableInstance.current = dragInstance.instance;
        }

        useWindowResize(ref, isMaximized, isResizing, setIsResizing, resizeData);
        useWindowFocus(ref, windowKey, focusWindow);

        // Manejar maximizado/restaurar
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el || !draggableInstance.current || isMinimized) return;

            if (isMaximized) {
                draggableInstance.current.disable();
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    clearProps: "transform,x,y,top,left",
                });
            } else {
                const instance = draggableInstance.current;
                const savedX = instance.x || 0;
                const savedY = instance.y || 0;

                gsap.to(el, {
                    x: savedX,
                    y: savedY,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        instance.enable();
                        instance.update();
                    }
                });
            }
        }, [isMaximized, isMinimized]);

        // Manejar apertura/cierre con animación
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? "block" : "none";
        }, [isOpen]);

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={clsx(
                    "absolute",
                    isMaximized && "maximized",
                    isMinimized && "minimized" // ⭐ Clase opcional
                )}
            >
                <Component
                    {...props}
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                />
            </section>
        );
    };

    wrapped.displayName = `windowWrapper(${Component.displayName || Component.name || "Component"})`;

    return wrapped;
};

export default WindowWrapper;