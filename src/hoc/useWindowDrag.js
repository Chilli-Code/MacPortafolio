import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

export const useWindowDrag = (ref, windowKey, focusWindow) => {
    useGSAP(() => {
        const el = ref.current;
        if (!el) return;

        const header = el.querySelector('#window-header-mt') || el.querySelector('#window-header');
        const minY = 40;      // Límite superior
        const minB = 0;      // Límite inferior
        const minX = 0;       // Límite izquierdo
        const maxX = window.innerWidth; // Límite derecho

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
            }
        });

        return { instance, kill: () => instance.kill() };
    }, []);
};