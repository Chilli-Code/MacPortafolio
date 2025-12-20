import { WindowControls } from "#components";
import { locations } from "#constants";
import useLocationStore from "#store/location";
import WindowWrapper from "#hoc/WindowWrapper";
import clsx from "clsx";
import useWindowStore from "#store/window";
import { ChevronLeft, ChevronRight, Search } from "#assets/icons";


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
              draggable={false}
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
      <div id="window-header-mt" className="flex w-full items-center bg-gray-50 border-b border-gray-200 rounded-t-lg">
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

      <div className="flex h-full bg-white overflow-hidden">
        <div className="w-48 sidebar sidebarFolder flex-shrink-0 overflow-y-auto">
          {renderList('Favoritos', Object.values(locations))}
          {renderList('Mis proyectos', locations.work.children)}
        </div>

        {/* Área principal: misma que en el header */}
        <div className="flex-1 min-w-0 relative boxbg overflow-y-auto overflow-x-hidden">

          <ul
            className="content grid gap-6 p-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))'
            }}
          >
            {activeLocation?.children.map((item) => (
              <li
                title={item.name}
                key={item.id}
                className="flex flex-col items-center cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                onClick={() => openItem(item)}
              >
                <img draggable={false} onDragStart={(e) => e.preventDefault()} src={item.icon} alt={item.name} className="object-contain mb-2 group-hover:scale-110 transition-transform select-none" />
                <p className="text-sm font-medium text-center truncate w-full px-1">{item.name}</p>
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