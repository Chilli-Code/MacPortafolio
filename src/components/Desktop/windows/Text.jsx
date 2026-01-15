import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/Desktop";
import useWindowStore from "#store/window.js";
import { useEffect } from 'react'; // ← IMPORTAR useEffect

const Text = ({ isMaximized, setIsMaximized }) => {
    const { windows, closeWindow } = useWindowStore(); // ← AGREGAR closeWindow
    const data = windows?.txtfile?.data;

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    // ✅ Cerrar ventana si no hay data después de recargar
    useEffect(() => {
        if (!data && windows.txtfile?.isOpen) {
            console.log('❌ No hay data, cerrando ventana txtfile');
            closeWindow('txtfile');
        }
    }, [data, windows.txtfile?.isOpen, closeWindow]);

    if (!data) return null;

    const { name, image, subtitle, description, id } = data;

    return (
        <>
            <div id="window-header">
                <WindowControls target="txtfile" onMaximize={handleMaximize} />
                <h2>{name}</h2>
            </div>

            <div className="p-5 space-y-6 bg-white bgText overflow-y-auto">
                {image ? (
                    <div className="w-full">
                        <img
                            draggable={false}
                            src={image}
                            alt={name}
                            className="w-full h-auto rounded"
                            style={id === 4 ? { filter: "drop-shadow(rgb(0, 183, 255) 5px 10px 12px)" } : {}}
                        />
                    </div>
                ) : null}

                {subtitle ? (
                    <h3 className="text-lg font-semibold">{subtitle}</h3>
                ) : null}

                {Array.isArray(description) && description.length > 0 ? (
                    <div className="space-y-3 leading-relaxed text-base text-gray-800">
                        {description.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
};

const TextWindow = WindowWrapper(Text, "txtfile");
export default TextWindow;