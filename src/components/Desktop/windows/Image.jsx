import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { useEffect } from 'react';

const ImageWindowContent = ({ isMaximized, setIsMaximized }) => {
    const { windows, closeWindow } = useWindowStore();
    const data = windows.imgfile?.data;

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    // ✅ Cerrar ventana si no hay data después de recargar
    useEffect(() => {
        if (!data && windows.imgfile?.isOpen) {
            console.log('❌ No hay data, cerrando ventana imgfile');
            closeWindow('imgfile');
        }
    }, [data, windows.imgfile?.isOpen, closeWindow]);

    // ⚠️ NO renderizar nada si no hay data
    if (!data) {
        return null;
    }

    const { name, imageUrl } = data;

    return(
        <>
            <div id="window-header">
                <WindowControls target="imgfile" onMaximize={handleMaximize}/>
                <h2>{name}</h2>
            </div>

            <div className="p-5 flex items-center bgImage h-full justify-center bg-gray-50 dark:bg-[#1E1E1E]">
                {imageUrl && (
                    <div className="w-full">
                        <img 
                            src={imageUrl} 
                            alt={name}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                            draggable={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

const ImageWindow = WindowWrapper(ImageWindowContent, "imgfile");

export default ImageWindow;