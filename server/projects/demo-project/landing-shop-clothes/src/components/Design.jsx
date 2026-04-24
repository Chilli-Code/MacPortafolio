import { Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Design = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const handleEnded = () => {
            setIsPlaying(false);
            vid.currentTime = 0;
        };

        vid.addEventListener("ended", handleEnded);
        return () => vid.removeEventListener("ended", handleEnded);
    }, []);

    const handlePlayClick = async () => {
        const vid = videoRef.current;
        if (!vid) return;

        setIsPlaying(true);

        try {
            vid.currentTime = 0;
            vid.muted = true;
            await vid.play();
        } catch (err) {
            setIsPlaying(false);
            console.warn("Error al intentar reproducir el video:", err);
        }
    };

    return (
        <div className="bg-white py-20 text-center">
            <h2 className="text-6xl impact leading-tight text-zinc-900 tracking-tight mb-12 uppercase">
                WANT TO DESIGN YOUR OWN? <br /> FIT, WE CAN DO IT
            </h2>

            <div className="max-w-7xl mx-auto px-4 aspect-square lg:aspect-[2/1] bg-zinc-300 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">

                    <video
                        ref={videoRef}
                        className={`size-fit saturate-120 object-cover w-full h-full ${isPlaying ? "pointer-events-none" : ""}`}
                    >
                        <source src="/videos/wedding.mp4" type="video/mp4" />
                        Tu navegador no soporta el video.
                    </video>

                    {!isPlaying && (
                        <div
                            onClick={handlePlayClick}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") handlePlayClick();
                            }}
                            role="button"
                            tabIndex={0}
                            className="size-20 bg-zinc-800/60 backdrop-blur-xs rounded-full absolute center-item border-2 border-white cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-center"
                        >
                            <Play className="text-white" size={30} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Design;
