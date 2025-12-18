import { useEffect } from "react";

export const useWindowFocus = (ref, windowKey, focusWindow) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleClick = (e) => {
            if (e.target.classList.contains('resize-handle')) return;
            focusWindow(windowKey);
        };

        el.addEventListener('mousedown', handleClick);

        return () => {
            el.removeEventListener('mousedown', handleClick);
        };
    }, [focusWindow, windowKey]);
};