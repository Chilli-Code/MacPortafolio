// src/hooks/useWindowDrag.js
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import { useRef } from "react";

export const useWindowDrag = (ref, windowKey, focusWindow) => {
    const { saveWindowPosition } = useWindowStore();
    const saveTimeoutRef = useRef(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el) return;

        const header = el.querySelector('#window-header-mt') || el.querySelector('#window-header');
        const minY = 40;
        const minB = 0;
        const minX = 0;
        const maxX = window.innerWidth;

        const [instance] = Draggable.create(el, {
            onPress: () => focusWindow(windowKey),
            trigger: header,
            
            onDrag: function() {
                const rect = el.getBoundingClientRect();
                
                // Límite superior
                if (rect.top < minY) {
                    const currentY = gsap.getProperty(el, "y");
                    const offset = minY - rect.top;
                    gsap.set(el, { y: currentY + offset });
                }
                
                // Límite inferior
                if (rect.bottom > window.innerHeight - minB) {
                    const currentY = gsap.getProperty(el, "y");
                    const offset = (window.innerHeight - minB) - rect.bottom;
                    gsap.set(el, { y: currentY + offset });
                }
                
                // Límite izquierdo
                if (rect.left < minX) {
                    const currentX = gsap.getProperty(el, "x");
                    const offset = minX - rect.left;
                    gsap.set(el, { x: currentX + offset });
                }
                
                // Límite derecho
                if (rect.right > maxX) {
                    const currentX = gsap.getProperty(el, "x");
                    const offset = maxX - rect.right;
                    gsap.set(el, { x: currentX + offset });
                }
            },
            
            onDragStart: function () {
                const target = this.pointerEvent?.target;
                if (target?.classList.contains('resize-handle')) {
                    this.endDrag(this.pointerEvent);
                }
            },

            // 🆕 GUARDAR POSICIÓN AL SOLTAR
            onDragEnd: function() {
                // Cancelar timeout anterior
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }

                // Obtener posición actual
                const x = parseFloat(gsap.getProperty(el, "x")) || 0;
                const y = parseFloat(gsap.getProperty(el, "y")) || 0;
                
                console.log(`🎯 onDragEnd - Posición detectada:`, { x, y, windowKey });
                
                // Guardar inmediatamente (sin debounce para debugging)
                saveWindowPosition(windowKey, { x, y });
            }
        });

        // ⚠️ CRÍTICO: Guardar la instancia para poder accederla desde fuera
        el._draggableInstance = instance;

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            instance.kill();
        };
    }, { scope: ref }); // ⚠️ Sin dependencies extras

    // Retornar la instancia guardada en el elemento
    return { 
        instance: ref.current?._draggableInstance
    };
};