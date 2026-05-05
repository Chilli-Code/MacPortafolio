import { WindowControls } from "#components/Desktop";
import { locations } from "#constants";
import useLocationStore from "#store/location";
import WindowWrapper from "#hoc/WindowWrapper";
import clsx from "clsx";
import useWindowStore from "#store/window";
import { ChevronLeft, ChevronRight, Search } from "#assets/icons";
import { useEffect, useState, useMemo, useCallback } from "react";


// Recibe isMaximized y setIsMaximized como props del WindowWrapper
const Finder = ({ isMaximized, setIsMaximized }) => {
  const { openWindow } = useWindowStore();
  const { 
    activeLocation, 
    setActiveLocation, 
    goBack, 
    goForward,
    canGoBack,
    canGoForward 
  } = useLocationStore();
  
  const [serverFiles, setServerFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, item: null });

  // ✅ CARGAMOS LOS DATOS DEL SERVIDOR DIRECTAMENTE, SIN PASAR POR EL STORE
  useEffect(() => {
    const loadServerFolders = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:3001/api/folders');
        
        const serverProjects = await response.json();
        
        setServerFiles(serverProjects);

      } catch (error) {
        setServerFiles([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeLocation?.type === 'work' || !activeLocation) {
      loadServerFolders();
    }
  }, [activeLocation?.type]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const openItem = useCallback((item) => {
    if (item.kind == 'folder') {
      return setActiveLocation(item);
    }
    
    if (item.id.startsWith('server-projects')) {
      return;
    }

    if (item.fileType == 'pdf') return openWindow("resume");
    if (['fig', 'url'].includes(item.fileType) && item.href)
      return window.open(item.href, "_blank");

    openWindow(`${item.fileType}${item.kind}`, item);
  }, [setActiveLocation, openWindow]);

  // ✅ Context Menu - Click derecho
  const handleContextMenu = useCallback((e, item) => {
    e.preventDefault();
    if (item.kind === 'folder') {
      setContextMenu({ show: true, x: e.clientX, y: e.clientY, item });
    }
  }, []);

  // ✅ Cerrar context menu al hacer click en cualquier parte
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, show: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // ✅ Abrir carpeta con CodeEditor
  const openWithCodeEditor = useCallback((item) => {
    openWindow('codeeditor', { projectName: item.name });
    setContextMenu(prev => ({ ...prev, show: false }));
  }, [openWindow]);

const renderList = (name, items, className = "") => (
  <div className={className}>
    <h3>{name}</h3>

    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => setActiveLocation(item)}
          className={clsx(
            item.id == activeLocation.id
              ? "active"
              : "not-active notActive"
          )}
        >
          <img draggable={false} src={item.icon} className="w-4" alt="" />
          <p className="text-sm font-medium truncate">{item.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

const displayFiles = useMemo(() => {
  if (activeLocation?.type !== 'work' && activeLocation?.children) {
    return activeLocation.children;
  }
  return serverFiles;
}, [activeLocation, serverFiles]);

const favoriteLocations = useMemo(() => Object.values(locations), [locations]);

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
              <button 
                aria-label="Ir hacia atrás"
                onClick={goBack}
                disabled={!canGoBack()}
                className={clsx({ 'opacity-30 cursor-not-allowed': !canGoBack() })}
              >
                <ChevronLeft className="icon" />
              </button>
              <button 
                aria-label="Ir hacia adelante"
                onClick={goForward}
                disabled={!canGoForward()}
                className={clsx({ 'opacity-30 cursor-not-allowed': !canGoForward() })}
              >
                <ChevronRight className="icon" />
              </button>

            </div>
            <button 
              aria-label="Buscar"
              onClick={() => setShowSearch(!showSearch)}
              className={clsx({ 'text-blue-500': showSearch })}
            >
              <Search className="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full bg-white overflow-hidden">
        <div className="w-48 sidebar sidebarFolder flex-shrink-0 overflow-y-auto">
          {renderList('Favoritos', favoriteLocations)}
          {renderList('Mis proyectos', displayFiles, 'mb-10')}
        </div>

        {/* Área principal: misma que en el header */}
        <div className="flex-1 min-w-0 relative boxbg overflow-y-auto overflow-x-hidden">

          <ul
            className="content grid gap-6 p-6 mb-10"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))'
            }}
          >
            {loading ? (
              <li className="text-center text-gray-400 col-span-3 py-20">
                Cargando archivos del servidor...
              </li>
            ) : (
              displayFiles.map((item) => (
                <li
                  title={item.name}
                  key={item.id}
                  className="flex flex-col items-center cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                  onClick={() => openItem(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <img draggable={false} onDragStart={(e) => e.preventDefault()} src={item.icon} alt={item.name} className="object-contain mb-2 group-hover:scale-110 transition-transform select-none" />
                  <p className="text-sm font-medium text-center truncate w-full px-1">{item.name}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* ✅ Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
            onClick={() => openWithCodeEditor(contextMenu.item)}
          >
            <span className="text-lg">📝</span>
            <span>Abrir con CodeEditor</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
            onClick={() => {
              setActiveLocation(contextMenu.item);
              setContextMenu(prev => ({ ...prev, show: false }));
            }}
          >
            <span className="text-lg">📁</span>
            <span>Abrir como carpeta</span>
          </button>
        </div>
      )}
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;