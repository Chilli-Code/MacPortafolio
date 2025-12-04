import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { profileLinks, gallery } from "#constants";
import clsx from "clsx";
import { useState } from "react";
import { Search } from "lucide-react";


const Profile = ({ isMaximized, setIsMaximized }) => {
    const { windows } = useWindowStore();

    const { openWindow } = useWindowStore();
    const [activeItem, setActiveItem] = useState(profileLinks[0]);

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
                            "flex ssf items-center gap-2 px-2 py-1 rounded cursor-pointer transition",
                            item.id === activeItem.id
                                ? "bg-blue-100 !text-blue-700" 
                                : "hover:bg-[#dbeafe] hover:!text-blue-700" 
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
            <div id="window-header-mt" className="flex w-full justify-between items-center bg-gray-50 border-b border-gray-200 rounded-t-lg">
                <div className="h-full w-48 px-6 ttt">
                    <WindowControls target="profile" onMaximize={handleMaximize} />
                </div>

                <div id="window-header" className=" headerProf flex w-full justify-between border-r border-l border-gray-200 rounded-[inherit]">
                    <div className="flex items-center gap-1 w-full justify-between">
                        <div>
                            <h2>Acerca de mí</h2>
                        </div>
                        <div>
                            <Search className="icon" />
                        </div>
                    </div>
                </div>


            </div>
            <div className="bg-white flex h-full">
                <div className="sidebar">
                    {renderList("Favoritos", profileLinks)}
                </div>
                <div className="content flex flex-col gap-4 p-4">
                    <div className="p-5 space-y-5 bgProf">
                        <img
                            src="/images/jorge-2.jpg"
                            alt="Jorge"
                            className="w-30 rounded-md"
                        />
                        <div className="space-y-3 leading-relaxed text-base text-gray-800">
                            <p>
                                ¡Hola! Soy Jorge 👋, un desarrollador web al que le gusta crear sitios web elegantes e interactivos que realmente funcionan bien.,
                                Me especializo en JavaScript, React y Next.js, y me encanta hacer que las cosas funcionen con fluidez, rapidez y un toque de encanto.,
                                Me gusta mucho la interfaz de usuario limpia, la buena experiencia de usuario y escribir código que no requiera un equipo de búsqueda para depurarlo.,
                                Fuera del trabajo de desarrollo, me encontrarás retocando diseños a las 2 de la madrugada, bebiendo café carísimo o comprando por impulso gadgets que me he convencido a mí mismo de que necesito 😅.,

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const ProfileWindow = WindowWrapper(Profile, "profile");

export default ProfileWindow;