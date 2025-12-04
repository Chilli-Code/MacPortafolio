import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import clsx from "clsx";

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);
        const draggableInstance = useRef(null);
        const [isMaximized, setIsMaximized] = useState(false);
        const [isResizing, setIsResizing] = useState(false);
        const resizeData = useRef({});

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

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            // Buscar el header correcto (puede ser window-header-mt o window-header)
            const header = el.querySelector('#window-header-mt') || el.querySelector('#window-header');

            const [instance] = Draggable.create(el, {
                onPress: () => focusWindow(windowKey),
                trigger: header, // Solo el header es arrastrable
                onDragStart: function () {
                    // Prevenir drag si está sobre un resize handle
                    const target = this.pointerEvent?.target;
                    if (target?.classList.contains('resize-handle')) {
                        this.endDrag(this.pointerEvent);
                    }
                }
            });

            draggableInstance.current = instance;

            return () => instance.kill();
        }, []);

        // Resize functionality
        useEffect(() => {
            const el = ref.current;
            if (!el || isMaximized) return;

            const handleMouseDown = (e, direction) => {
                if (isMaximized) return;

                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);

                const rect = el.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = rect.width;
                const startHeight = rect.height;
                const startLeft = rect.left;
                const startTop = rect.top;

                resizeData.current = {
                    direction,
                    startX,
                    startY,
                    startWidth,
                    startHeight,
                    startLeft,
                    startTop,
                };

                document.body.style.cursor = window.getComputedStyle(e.target).cursor;
            };

const handleMouseMove = (e) => {
    if (!isResizing) return;

    const { direction, startX, startY, startWidth, startHeight, startLeft, startTop } = resizeData.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    const minWidth = 400;
    const minHeight = 300;

    if (direction.includes('e')) {
        newWidth = Math.max(minWidth, startWidth + deltaX);
    }
    if (direction.includes('w')) {
        newWidth = Math.max(minWidth, startWidth - deltaX);
        if (newWidth > minWidth) {
            newLeft = startLeft + deltaX;
        }
    }
    if (direction.includes('s')) {
        newHeight = Math.max(minHeight, startHeight + deltaY);
    }
if (direction.includes('n')) {
    newHeight = Math.max(minHeight, startHeight - deltaY);
    if (newHeight > minHeight) {
        newTop = Math.max(40, startTop + deltaY); // ← Limitar a 40px mínimo
    }
    }

    // Limitar top mínimo durante resize
    newTop = Math.max(40, newTop); // ← Límite de 40px

    gsap.set(el, {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
    });
};

            const handleMouseUp = () => {
                if (isResizing) {
                    setIsResizing(false);
                    document.body.style.cursor = '';
                }
            };

            // Crear handles de resize
            const handles = [
                { dir: 'n', cursor: 'ns-resize', style: 'top: 0; left: 10px; right: 10px; height: 5px;' },
                { dir: 's', cursor: 'ns-resize', style: 'bottom: 0; left: 10px; right: 10px; height: 5px;' },
                { dir: 'e', cursor: 'ew-resize', style: 'right: 0; top: 10px; bottom: 10px; width: 5px;' },
                { dir: 'w', cursor: 'ew-resize', style: 'left: 0; top: 10px; bottom: 10px; width: 5px;' },
                { dir: 'ne', cursor: 'nesw-resize', style: 'top: 0; right: 0; width: 10px; height: 10px;' },
                { dir: 'nw', cursor: 'nwse-resize', style: 'top: 0; left: 0; width: 10px; height: 10px;' },
                { dir: 'se', cursor: 'nwse-resize', style: 'bottom: 0; right: 0; width: 10px; height: 10px;' },
                { dir: 'sw', cursor: 'nesw-resize', style: 'bottom: 0; left: 0; width: 10px; height: 10px;' },
            ];

            const handleElements = handles.map(({ dir, cursor, style }) => {
                const handle = document.createElement('div');
                handle.className = 'resize-handle';
                handle.style.cssText = `position: absolute; ${style} cursor: ${cursor}; z-index: 10; pointer-events: auto;`; // ← pointer-events: auto
                handle.addEventListener('mousedown', (e) => handleMouseDown(e, dir));
                el.appendChild(handle);
                return handle;
            });

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                handleElements.forEach(handle => handle.remove());
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }, [isResizing, isMaximized]);

        // Manejar maximizado/restaurar con animación
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el || !draggableInstance.current) return;

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
        }, [isMaximized]);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? "block" : "none";
        }, [isOpen]);
// Agregar este useEffect después del useGSAP del Draggable
useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e) => {
        // No hacer focus si está clickeando en un resize handle
        if (e.target.classList.contains('resize-handle')) return;
        
        focusWindow(windowKey);
    };

    el.addEventListener('mousedown', handleClick);

    return () => {
        el.removeEventListener('mousedown', handleClick);
    };
}, [focusWindow, windowKey]);
        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={clsx("absolute", isMaximized && "maximized")}
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