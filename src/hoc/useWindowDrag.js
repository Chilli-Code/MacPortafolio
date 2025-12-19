import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

export const useWindowDrag = (ref, windowKey, focusWindow) => {
    useGSAP(() => {
        const el = ref.current;
        if (!el) return;

        const header = el.querySelector('#window-header-mt') || el.querySelector('#window-header');
        const minY = 56;

        const [instance] = Draggable.create(el, {
            onPress: () => focusWindow(windowKey),
            trigger: header,
            onDrag: function() {
                const rect = el.getBoundingClientRect();
                if (rect.top < minY) {
                    const currentY = gsap.getProperty(el, "y");
                    const offset = minY - rect.top;
                    gsap.set(el, { y: currentY + offset });
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