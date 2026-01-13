import { useEffect } from "react";
import useWindowStore from "#store/window";
import useSounds from "#hooks/useSounds";

const WindowControls = ({target, onMaximize}) => {
    const { closeWindow, minimizeWindow  } = useWindowStore();
    const { initSounds, playWindowClose, playWindowMinimize, playWindowMaximize } = useSounds();

    // Inicializar sonidos
    useEffect(() => {
        initSounds();
    }, [initSounds]);

    const handleClose = () => {
        console.log('🎵 Reproduciendo sonido de cerrar ventana');
        playWindowClose();
        closeWindow(target);
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        console.log('🎵 Reproduciendo sonido de minimizar ventana');
        playWindowMinimize();
        minimizeWindow(target);
    };

    const handleMaximize = () => {
        console.log('🎵 Reproduciendo sonido de maximizar ventana');
        playWindowMaximize();
        onMaximize();
    };

    return (
        <div id="window-controls">
            <div className="close" onClick={handleClose} />
            <div className="minimize" onClick={handleMinimize}/>
            <div className="maximize" onClick={handleMaximize} />
        </div>
    )
}

export default WindowControls;