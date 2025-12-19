// src/windows/Settings.jsx
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { settingsLinks } from "#constants";
import clsx from "clsx";
import { useState } from "react";
import AppearanceSection from "#components/Settings/sections/AppearanceSection";
import SoundSection from "#components/Settings/sections/SoundSection";
import PermissionsSection from "#components/Settings/sections/PermissionsSection";
import LanguageSection from "#components/Settings/sections/LanguageSection";
import AccountSection from "#components/Settings/sections/AccountSection";
import { useTranslate  } from "#hoc/useTranslate";

const Settings = ({ isMaximized, setIsMaximized }) => {
    const { t } = useTranslate();
    const [activeItem, setActiveItem] = useState(settingsLinks[0]);

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const renderList = (name, items) => (
        <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
                {name}
            </h3>
            <ul className="space-y-1">
                {items.map((item) => (
                    <li
                        alt={item.title}
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={clsx(
                            "flex items-center text-gray-900 dark:text-white gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                            item.id === activeItem.id
                                ? "bg-blue-100 !text-blue-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                    >
                        <img draggable={false} src={item.icon} className="w-4 h-4" alt={t(item.title)} />
                        <p className="text-sm font-medium truncate">{t(item.title)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

    // Mapeo de secciones
    const renderSection = () => {
        switch (activeItem.id) {
            case 1:
                return <AppearanceSection />;
            case 2:
                return <SoundSection />;
            case 3:
                return <PermissionsSection />;
            case 4:
                return <LanguageSection />;
            case 5:
                return <AccountSection />;
            default:
                return <AppearanceSection />;
        }
    };

    return (
        <>
            <div id="window-header" className="bgt">
                <WindowControls target="settings" onMaximize={handleMaximize} />
                <h2 className="text-sm font-semibold">{t("configuration")}</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-900 flex h-full overflow-hidden">
                {/* Sidebar */}
                <div className="w-40 bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                    {renderList(t("seccions"), settingsLinks)}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </>
    );
};

const SettingsWindow = WindowWrapper(Settings, 'settings');

export default SettingsWindow;