// src/hoc/WindowWrapper.jsx
import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import clsx from "clsx";
import { useWindowDrag } from "./useWindowDrag";
import { useWindowResize } from "./useWindowResize";
import { useWindowFocus } from "./useWindowFocus";

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows, saveMaximizedState } = useWindowStore();
        const { isOpen, isMinimized, zIndex, position, size, isMaximized: savedMaximized } = windows[windowKey];
        const ref = useRef(null);
        const draggableInstance = useRef(null);
        const [isMaximized, setIsMaximized] = useState(savedMaximized || false);
        const [isResizing, setIsResizing] = useState(false);
        const resizeData = useRef({});
        const hasRestoredPosition = useRef(false);

        // 🆕 Restaurar posición guardada al montar
// 🆕 Restaurar posición guardada al montar
useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isOpen) return;

    if (hasRestoredPosition.current) return;

    // Restaurar posición usando porcentaje si existe
    if (position?.xPercent != null && position?.yPercent != null) {
        gsap.set(el, {
            x: position.xPercent * window.innerWidth,
            y: position.yPercent * window.innerHeight
        });
        console.log(`📍 Posición restaurada para ${windowKey}:`, {
            x: position.xPercent * window.innerWidth,
            y: position.yPercent * window.innerHeight
        });
    } else if (position) {
        // Fallback píxeles
        gsap.set(el, { x: position.x, y: position.y });
    }

    // Restaurar tamaño usando porcentaje si existe
    if (size?.widthPercent != null && size?.heightPercent != null) {
        gsap.set(el, {
            width: size.widthPercent * window.innerWidth,
            height: size.heightPercent * window.innerHeight
        });
        console.log(`📏 Tamaño restaurado para ${windowKey}:`, {
            width: size.widthPercent * window.innerWidth,
            height: size.heightPercent * window.innerHeight
        });
    } else if (size) {
        // Fallback píxeles
        gsap.set(el, { width: size.width, height: size.height });
    }

    hasRestoredPosition.current = true;
}, [isOpen, position, size, windowKey]);


        // 🆕 Guardar estado de maximizado cuando cambia
        useEffect(() => {
            if (isOpen) {
                saveMaximizedState(windowKey, isMaximized);
            }
        }, [isMaximized, isOpen, windowKey, saveMaximizedState]);

        // Animación de minimizar/restaurar
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            if (isMinimized) {
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
            } else if (hasRestoredPosition.current) {
                // Solo restaurar si ya se cargó la posición inicial
                el.style.visibility = 'visible';
                el.style.pointerEvents = 'auto';
                gsap.to(el, {
                    scale: 1,
                    opacity: 1,
                    // ⚠️ NO tocar Y aquí - draggable lo maneja
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        }, [isMinimized, isOpen]);

        // Animación de apertura inicial
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen || hasRestoredPosition.current) return;

            el.style.display = "none";

            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    duration: 0.2, 
                    ease: "power3.out"
                }
            );
        }, [isOpen]);

        // Hooks personalizados
        const dragInstance = useWindowDrag(ref, windowKey, focusWindow);
        if (dragInstance?.instance) {
            draggableInstance.current = dragInstance.instance;
        }

        useWindowResize(ref, isMaximized, isResizing, setIsResizing, resizeData, windowKey);
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
                const savedX = position?.x || instance.x || 0;
                const savedY = position?.y || instance.y || 0;

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
        }, [isMaximized, isMinimized, position]);

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
                    isMinimized && "minimized"
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