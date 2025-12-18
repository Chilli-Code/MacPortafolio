import { useEffect } from "react";
import gsap from "gsap";

export const useWindowResize = (ref, isMaximized, isResizing, setIsResizing, resizeData) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || isMaximized) return;

        const handleMouseDown = (e, direction) => {
            if (isMaximized) return;

            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);

            // ← NUEVO: Obtener posición REAL sin transforms
            const computedStyle = window.getComputedStyle(el);
            const matrix = new DOMMatrix(computedStyle.transform);
            const currentX = matrix.m41; // translateX
            const currentY = matrix.m42; // translateY
            
            const rect = el.getBoundingClientRect();
            
            // Calcular posición real restando los transforms
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
                realLeft: realLeft + currentX, // ← Posición real
                realTop: realTop + currentY,   // ← Posición real
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
                realTop
            } = resizeData.current;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = realLeft;  // ← Usar posición real
            let newTop = realTop;    // ← Usar posición real

            const minWidth = 400;
            const minHeight = 300;
            const minTopLimit = 56;

            // Redimensionar horizontalmente (derecha)
            if (direction.includes('e')) {
                newWidth = Math.max(minWidth, startWidth + deltaX);
            }
            
            // Redimensionar horizontalmente (izquierda)
            if (direction.includes('w')) {
                const proposedWidth = startWidth - deltaX;
                if (proposedWidth >= minWidth) {
                    newWidth = proposedWidth;
                    newLeft = realLeft + deltaX;
                } else {
                    newWidth = minWidth;
                }
            }
            
            // Redimensionar verticalmente (abajo)
            if (direction.includes('s')) {
                newHeight = Math.max(minHeight, startHeight + deltaY);
            }
            
            // Redimensionar verticalmente (arriba)
            if (direction.includes('n')) {
                const proposedHeight = startHeight - deltaY;
                const proposedTop = realTop + deltaY; // ← Usar posición real
                
                if (proposedTop >= minTopLimit && proposedHeight >= minHeight) {
                    newHeight = proposedHeight;
                    newTop = proposedTop;
                } else if (proposedTop < minTopLimit) {
                    newTop = minTopLimit;
                    newHeight = startHeight + (realTop - minTopLimit);
                } else {
                    newHeight = minHeight;
                }
            }

            // Asegurar límites
            newTop = Math.max(minTopLimit, newTop);

            // ← IMPORTANTE: Limpiar transforms antes de aplicar nuevos valores
            gsap.set(el, {
                x: 0,
                y: 0,
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
    }, [isResizing, isMaximized]);
};