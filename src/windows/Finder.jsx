import { Search } from "lucide-react";
import { WindowControls } from "#components";
import { locations } from "#constants";
import useLocationStore from "#store/location";
import WindowWrapper from "#hoc/WindowWrapper";
import clsx from "clsx";
import useWindowStore from "#store/window";
import { ChevronLeft, ChevronRight } from "lucide-react";


// Recibe isMaximized y setIsMaximized como props del WindowWrapper
const Finder = ({ isMaximized, setIsMaximized }) => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const openItem = (item) => {
        if (item.fileType == 'pdf') return openWindow("resume");
        if (item.kind == 'folder') return setActiveLocation(item);
        if (['fig', 'url'].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank");

        openWindow(`${item.fileType}${item.kind}`, item);
    };

    const renderList = (name, items) => (
        <div>
            <h3>{name}</h3>

            <ul>
                {items.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActiveLocation(item)}
                        className={clsx(item.id == activeLocation.id ? "active" : "not-active notActive",)}
                    >
                        <img
                            src={item.icon}
                            className="w-4"
                            alt={item.name}
                        />
                        <p className="text-sm font-medium truncate">
                            {item.name}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );

return (
  <>
    <div  id="window-header-mt" className="flex w-full items-center bg-gray-50 border-b border-gray-200 rounded-t-lg">
      {/* Sidebar fijo (controles de ventana) */}
      <div className="h-full w-48 px-6 ttt">
        <WindowControls target="finder" onMaximize={handleMaximize} />
      </div>

      {/* Área principal: se alineará con el contenido de abajo */}
      <div className="flex-1 min-w-0 overflow-x-hidden bordertp ">
        <div
          id="window-headesr"
          className="ft flex justify-between items-center border-r border-gray-200 h-full px-4"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="icon" />
            <ChevronRight className="icon" />
          </div>
          <div>
            <Search className="icon" />
          </div>
        </div>
      </div>
    </div>

    {/* Contenido: misma estructura */}
    <div className="flex h-full bg-white">
      {/* Sidebar de navegación */}
      <div className="w-48 sidebar sidebarFolder">
        {renderList('Favoritos', Object.values(locations))}
        {renderList('Mis proyectos', locations.work.children)}
      </div>

      {/* Área principal: misma que en el header */}
      <div className="flex-1 min-w-0 relative">
        <ul className="content h-full">
          {activeLocation?.children.map((item) => (
            <li
              key={item.id}
              className={item.position}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
);
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;