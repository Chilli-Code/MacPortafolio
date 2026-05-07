import { WindowControls } from "#components/Desktop";
import { locations } from "#constants";
import useLocationStore from "#store/location";
import WindowWrapper from "#hoc/WindowWrapper";
import clsx from "clsx";
import useWindowStore from "#store/window";
import { ChevronLeft, ChevronRight, Search, Code, File, Folders } from "#assets/icons";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

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
  const [selectedItem, setSelectedItem] = useState(null);
  // ← REF al contenedor raíz del Finder
  const rootRef = useRef(null);

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

  const handleMaximize = () => setIsMaximized(!isMaximized);

  const openItem = useCallback((item) => {
    if (item.kind == 'folder') return setActiveLocation(item);
    if (item.id.startsWith('server-projects')) return;
    if (item.fileType == 'pdf') return openWindow("resume");
    if (['fig', 'url'].includes(item.fileType) && item.href)
      return window.open(item.href, "_blank");
    openWindow(`${item.fileType}${item.kind}`, item);
  }, [setActiveLocation, openWindow]);

  // ← CLAVE: usa e.currentTarget (el li) para anclar al ícono
  const handleContextMenu = useCallback((e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.kind !== 'folder') return;
    setSelectedItem(item.id);

    // Rect del li (el ícono de carpeta)
    const liRect = e.currentTarget.getBoundingClientRect();
    // Rect del contenedor raíz del Finder
    const rootRect = rootRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    const MENU_W = 220;
    const MENU_H = 85;

    // Posición relativa al rootRef (que tiene position: relative)
    let x = liRect.left - rootRect.left - 7;
    let y = liRect.bottom - rootRect.top - 40;

    // Si se sale por la derecha
    if (x + MENU_W > rootRect.width) x = (liRect.right - rootRect.left) - MENU_W;

    // Si se sale por abajo → aparece arriba del ícono
    if (y + MENU_H > rootRect.height) y = liRect.top - rootRect.top - MENU_H - 4;

    x = Math.max(4, x);
    y = Math.max(4, y);

    setContextMenu({ show: true, x, y, item });
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, show: false }));
      setSelectedItem(null); // ← limpia al cerrar
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

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
              item.id == activeLocation.id ? "active" : "not-active notActive"
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

  const favoriteLocations = useMemo(() => Object.values(locations), []);

  return (
    // ← position: relative aquí para que el menú absolute funcione
    <div ref={rootRef} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div id="window-header-mt" className="flex w-full items-center bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="h-full w-48 px-6 ttt">
          <WindowControls target="finder" onMaximize={handleMaximize} />
        </div>
        <div className="flex-1 min-w-0 overflow-x-hidden bordertp">
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

        <div className="flex-1 min-w-0 relative boxbg overflow-y-auto overflow-x-hidden">
          <ul
            className="content grid gap-6 p-6 mb-10"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
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
                  className={clsx(
                    "flex flex-col items-center cursor-pointer p-3 rounded-lg transition-colors group",
                    selectedItem === item.id
                      ? "bg-blue-50 scale-110"  // ← estado activo = mismo estilo que hover
                      : "hover:bg-blue-50"
                  )}
                  onClick={() => openItem(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <img
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    src={item.icon}
                    alt={item.name}
                    className="object-contain mb-2 group-hover:scale-110 transition-transform select-none"
                  />
                  <p className="text-sm font-medium text-center truncate w-full px-1">{item.name}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Context Menu — position absolute relativo al rootRef */}
      {contextMenu.show && (
        <div
          style={{
            position: 'absolute',   // ← absolute, no fixed
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 9999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white dark:bg-[#323232f2]"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '0.5px solid rgba(0,0,0,0.12)',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 10px 40px rgba(0,0,0,0.13)',
              padding: '4px',
              minWidth: '100px',
            }}>
            <button
              className="group w-full flex items-center gap-1 px-2 py-[6px] rounded-[6px]
             text-left transition-colors duration-75
             text-gray-700 dark:text-white
             hover:bg-blue-50 hover:text-gray-700
             dark:hover:text-gray-700"
              style={{ fontSize: '13px', }}
              onClick={() => openWithCodeEditor(contextMenu.item)}
            >
              <span style={{ fontSize: '15px' }}><Code size={15} className="text-blue-300 dark:text-blue-100 group-hover:text-gray-700" /></span>
              <span>Abrir CodeEditor</span>
            </button>
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '3px 0' }} />
            <button
              className="group w-full flex items-center gap-1 px-2 py-[6px] rounded-[6px]
             text-left transition-colors duration-75
             text-gray-700 dark:text-white
             hover:bg-blue-50 hover:text-gray-700
             dark:hover:text-gray-700"
              style={{ fontSize: '13px' }}
              onClick={() => {
                setActiveLocation(contextMenu.item);
                setContextMenu(prev => ({ ...prev, show: false }));
              }}
            >
              <span style={{ fontSize: '15px' }}><Folders size={15} className="text-blue-300 dark:text-blue-100 group-hover:text-gray-700" /></span>
              <span>Abrir carpeta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");
export default FinderWindow;