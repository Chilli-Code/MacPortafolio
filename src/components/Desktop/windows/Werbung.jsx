import { useState } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/Desktop";

const ads = [
    { id: 1, title: "Curso de Marketing Digital", desc: "Aprende a monetizar tu web con estrategias probadas. 50% de descuento esta semana.", date: "2026-05-01", type: "image", media: "https://picsum.photos/seed/marketing/800/450", link: "#" },
    { id: 2, title: "Hosting Premium", desc: "Alojamiento web ultra rápido para tu sitio monetizado. Primer mes gratis.", date: "2026-05-02", type: "image", media: "https://picsum.photos/seed/hosting/800/450", link: "#" },
    { id: 3, title: "Afiliados Amazon", desc: "Gana comisiones promocionando productos de la tienda más grande del mundo.", date: "2026-05-03", type: "video", media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", link: "#" },
    { id: 4, title: "Plantillas Web", desc: "Descarga plantillas optimizadas para AdSense y afiliados. Packs desde $9.", date: "2026-05-04", type: "image", media: "https://picsum.photos/seed/templates/800/450", link: "#" },
];

const Werbung = ({ isMaximized, setIsMaximized }) => {
    const [selectedAd, setSelectedAd] = useState(ads[0]);

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    return (
        <>
            <div id="window-header">
                <WindowControls target="werbung" onMaximize={handleMaximize} />
                <h2 className="flex items-center gap-2 justify-center w-full">Anuncios</h2>
            </div>
            <div className="flex h-full min-h-0 bg-white dark:bg-gray-900">
                <div className="w-48 sidebar bg-gray-50 dark:bg-gray-800 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide p-3 pb-2">
                        Lista de anuncios
                    </h3>
                    <ul>
                        {ads.map(ad => (
                            <li
                                key={ad.id}
                                onClick={() => setSelectedAd(ad)}
                                className={`px-3 py-2 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 ${selectedAd?.id === ad.id ? "bg-blue-100 dark:bg-gray-600 font-medium" : ""}`}
                            >
                                <p className="truncate">{ad.title}</p>
                                <p className="text-xs text-gray-400">{ad.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6">
                    {selectedAd ? (
                        <div className="max-w-2xl">
                            <p className="text-xs text-gray-400 mb-1">{selectedAd.date}</p>
                            <h2 className="text-xl font-semibold mb-4">{selectedAd.title}</h2>
                            {selectedAd.type === "video" ? (
                                <video src={selectedAd.media} controls className="w-full rounded-lg mb-4 bg-black" />
                            ) : (
                                <img src={selectedAd.media} alt={selectedAd.title} className="w-full rounded-lg mb-4 object-cover max-h-64" />
                            )}
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{selectedAd.desc}</p>
                            <a href={selectedAd.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Visitar anuncio
                            </a>
                        </div>
                    ) : (
                        <p className="text-gray-400 m-auto">Selecciona un anuncio</p>
                    )}
                </div>
            </div>
        </>
    );
}

const WerbungWindow = WindowWrapper(Werbung, "werbung");

export default WerbungWindow;