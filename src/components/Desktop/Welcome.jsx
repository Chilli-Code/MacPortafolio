import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuthStore } from '../../store/authStore';
import DeviceBlocker from "#components/DeviceBlocker";
import { usePerformanceMonitor } from '#hooks/usePerformanceMonitor'; // ✅ Importa del hook
import SystemResourcesSection from "#components/Systemresourcessection"; // ✅ Este es el componente visual

const FONT_WEIGHT = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 }
};

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `"wght" ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};


const setupTextHover = (container, type) => {
    if (!container) return () => { };

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHT[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `"wght" ${weight}`,

        });
    };

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));

            const intensity = Math.exp(- (distance ** 2) / 2000);

            animateLetter(letter, min + (max - min) * intensity);

        });
    };

    const handlemouseLeave = () =>
        letters.forEach((letter) => { animateLetter(letter, base, 0.3) });

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handlemouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousemove", handlemouseLeave);
    };

};


const Welcome = () => {
    const currentUser = useAuthStore(state => state.currentUser);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const { showMonitor } = usePerformanceMonitor();

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            subtitleCleanup();
            titleCleanup();
        };


    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText(
                    "Hola, Bienvenido :)",
                    "text-3xl font-georama",
                    100,
                )}
            </p>


            <h1 ref={titleRef} className="mt-7">
                {renderText(
                    `${currentUser.username}`,
                    "text-9xl italic font-georama"
                )}
            </h1>


        </section>
    );
}

export default Welcome;