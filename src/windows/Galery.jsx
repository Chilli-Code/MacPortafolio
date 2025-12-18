import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { photosLinks, gallery } from "#constants";
import clsx from "clsx";
import { Mail, Search } from "lucide-react";
import { useState } from "react";


const Galery = ({ isMaximized, setIsMaximized }) => {
    const { openWindow } = useWindowStore();
    const [activeItem, setActiveItem] = useState(photosLinks[0]);

   const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    const renderList = (name, items) => (
        <div>
            <h3 >{name}</h3>

            <ul>
                {items.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={clsx(
                            "flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition",
                            item.id === activeItem.id
                                ? "bg-blue-100 text-gray-700"
                                : "hover:bg-[#dbeafe] dark:hover:text-gray-700"
                        
                            )}
                    >
                        <img
                            draggable={false}
                            src={item.icon}
                            className="w-4"
                            alt={item.title}
                        />
                        <p className="text-sm font-medium truncate sss">
                            {item.title}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <div id="window-header">
                <WindowControls target="photos" onMaximize={handleMaximize} />
                <div className="flex w-auto space-around">
                    <Mail className="icon" />
                    <Search className="icon" />
                </div>
            </div>

            <div className="bg-white flex h-full">
                <div className="sidebar sidebarGalery">
                    {renderList("Fotos", photosLinks)}
                </div>
                <div className="content grid grid-cols-2 gap-4 p-4 w-full overflow-y-auto">
                    {gallery.map((photo) => (
                        <div
                            key={photo.id}
                            className="rounded overflow-hidden shadow-sm cursor-pointer"
                            onClick={() => openWindow("imgfile", {
                                name: `Imagen ${photo.id}`,
                                imageUrl: photo.img
                            })}
                        >
                            <img
                                draggable={false}
                                src={photo.img}
                                alt={`photo-${photo.id}`}
                                className="w-full h-60 object-cover"
                            />
                        </div>
                    ))}
                </div>


            </div>
        </>
    )

};

const GaleryWindow = WindowWrapper(Galery, "photos");

export default GaleryWindow;