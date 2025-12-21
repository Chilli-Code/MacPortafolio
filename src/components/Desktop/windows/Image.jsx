import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";


const ImageWindowContent = ({ isMaximized, setIsMaximized }) => {

    const { windows } = useWindowStore();
    const data  = windows.imgfile?.data;
// console.log("DATA RECIBIDA:", data);
   const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    if(!data) return null;

    const { name, imageUrl  } =data;

    return(
        <>
            <div id="window-header">
                <WindowControls target="imgfile" onMaximize={handleMaximize}  />
                <h2>{name}</h2>
            </div>

            <div className="p-5 bg-white bgImage">
                {imageUrl ? (
                    <div className="w-full">
                        <img
                        loading="lazy"
                        draggable={false}
                        src={imageUrl} 
                        alt={name} 
                        className="w-full h-auto max-h-[70vh] object-contain rounded"
                        />
                    </div>
                ): null}
            </div>
        </>
    );

};

const ImageWindow = WindowWrapper(ImageWindowContent, "imgfile");

export default ImageWindow;