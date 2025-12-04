import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { settingsLinks, gallery } from "#constants";
import clsx from "clsx";
import { Mail, Search } from "lucide-react";
import { useState } from "react";

const Settings = ({ isMaximized, setIsMaximized }) => {
    const [activeItem, setActiveItem] = useState(settingsLinks[0]);

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
            <div id="window-header" className="bgt">
                <WindowControls target="settings" onMaximize={handleMaximize} />
                <h2>Configuracion</h2>

            </div>
            <div className="bg-white flex h-full">
                <div className="sidebar">
                    {renderList("", settingsLinks)}
                </div>

                <div className="content w-full flex flex-col gap-4 p-4">
                    <div className="flex text-left">
                        <h2 className="flex text-left">Aperiencia</h2>
                    </div>
                    <div className="flex items-center">
                        <div className="w-medium bg-gray-200 h-medium">

                        </div>
                    </div>
                </div>
            </div>
        </>

    );

};

const SettingsWindow = WindowWrapper(Settings, 'settings');

export default SettingsWindow;