// src/hooks/useWindowResize.js
import { useEffect } from "react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";

export const useWindowResize = (ref, isMaximized, isResizing, setIsResizing, resizeData, windowKey) => {
    const { saveWindowSize } = useWindowStore();

    useEffect(() => {
        const el = ref.current;
        if (!el || isMaximized) return;

        const handleMouseDown = (e, direction) => {
            if (isMaximized) return;

            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);

            const computedStyle = window.getComputedStyle(el);
            const matrix = new DOMMatrix(computedStyle.transform);
            const currentX = matrix.m41;
            const currentY = matrix.m42;

            const rect = el.getBoundingClientRect();

            const realLeft = parseFloat(computedStyle.left) || 0;
            const realTop = parseFloat(computedStyle.top) || 0;

            resizeData.current = {
                direction,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                startLeft: rect.left,
                startTop: rect.top,
                realLeft: realLeft + currentX,
                realTop: realTop + currentY,
                transformX: currentX,
                transformY: currentY,
            };

            document.body.style.cursor = window.getComputedStyle(e.target).cursor;
        };

        const handleMouseMove = (e) => {
            if (!isResizing) return;

            const {
                direction,
                startX,
                startY,
                startWidth,
                startHeight,
                realLeft,
                realTop,
            } = resizeData.current;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = realLeft;
            let newTop = realTop;

            const minWidth = 400;
            const minHeight = 300;

            // 🔒 mismos límites que useWindowDrag
            const minX = 0;
            const minY = 40;
            const minB = 0;
            const maxX = window.innerWidth;
            const maxY = window.innerHeight - minB;

            // 👉 ESTE (derecha)
            if (direction.includes("e")) {
                const proposedWidth = startWidth + deltaX;
                const rightEdge = realLeft + proposedWidth;

                if (rightEdge <= maxX) {
                    newWidth = Math.max(minWidth, proposedWidth);
                } else {
                    newWidth = maxX - realLeft;
                }
            }

            // 👉 OESTE (izquierda)
            if (direction.includes("w")) {
                const proposedLeft = realLeft + deltaX;
                const proposedWidth = startWidth - deltaX;

                if (proposedLeft >= minX && proposedWidth >= minWidth) {
                    newLeft = proposedLeft;
                    newWidth = proposedWidth;
                } else {
                    newLeft = minX;
                    newWidth = startWidth + (realLeft - minX);
                }
            }

            // 👉 SUR (abajo)
            if (direction.includes("s")) {
                const proposedHeight = startHeight + deltaY;
                const bottomEdge = realTop + proposedHeight;

                if (bottomEdge <= maxY) {
                    newHeight = Math.max(minHeight, proposedHeight);
                } else {
                    newHeight = maxY - realTop;
                }
            }

            // 👉 NORTE (arriba)
            if (direction.includes("n")) {
                const proposedTop = realTop + deltaY;
                const proposedHeight = startHeight - deltaY;

                if (proposedTop >= minY && proposedHeight >= minHeight) {
                    newTop = proposedTop;
                    newHeight = proposedHeight;
                } else {
                    newTop = minY;
                    newHeight = startHeight + (realTop - minY);
                }
            }

            gsap.set(el, {
                x: 0,
                y: 0,
                width: newWidth,
                height: newHeight,
                left: newLeft,
                top: newTop,
            });

            resizeData.current.finalWidth = newWidth;
            resizeData.current.finalHeight = newHeight;
        };


        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                document.body.style.cursor = '';

                // 🆕 GUARDAR SOLO TAMAÑO AL SOLTAR (NO POSICIÓN)
                const { finalWidth, finalHeight } = resizeData.current;

                if (finalWidth && finalHeight) {
                    saveWindowSize(windowKey, {
                        width: finalWidth,
                        height: finalHeight
                    });

                    console.log(`💾 Tamaño guardado para ${windowKey}:`, {
                        width: finalWidth,
                        height: finalHeight
                    });
                }

                // ⚠️ NO guardar posición aquí porque interfiere con Draggable
                // La posición se guarda solo en onDragEnd del useWindowDrag
            }
        };

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
            handle.style.cssText = `position: absolute; ${style} cursor: ${cursor}; z-index: 10; pointer-events: auto;`;
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
    }, [isResizing, isMaximized, windowKey, saveWindowSize]);
};