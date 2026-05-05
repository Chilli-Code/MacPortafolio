// src/windows/CodeEditor.jsx
import { useState, useEffect, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/Desktop/WindowControls';
import useWindowStore from '#store/window';
import Editor from '@monaco-editor/react';
import { Save, RefreshCcw, CirclePlus, Folders, Download, HardDriveDownload, Eye, Terminal, Trash2, Trash} from '#assets/icons';
import { getTechConfig } from '#assets/techIcons/techConfig';

const CodeEditor = ({ isMaximized, setIsMaximized }) => {
  const { windows, closeWindow } = useWindowStore();
  const data = windows.codeeditor?.data;
  const editorRef = useRef(null);

  const folderFiles = data?.folderFiles || [];
  const projectName = data?.projectName || 'Proyecto';
  const currentProjectName = data?.projectName || 'demo-project';

  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [fileContents, setFileContents] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allFiles, setAllFiles] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [terminalWorkingDir, setTerminalWorkingDir] = useState('');
  const terminalRef = useRef(null);

  // ✅ CARGAR ARCHIVOS - Soporta projectName dinámico o folderFiles directo
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);
        
        let files = [];
        
        // Si se pasan folderFiles directamente, usarlos
        if (data?.folderFiles && data.folderFiles.length > 0) {
          files = data.folderFiles;
        } 
        // Si hay projectName, cargar del endpoint
        else if (data?.projectName) {
          const response = await fetch(`http://localhost:3001/api/projects/${data.projectName}/files`);
          files = await response.json();
        } 
        // Fallback a demo-project
        else {
          const response = await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files`);
          files = await response.json();
        }
        
        setAllFiles(files);
        setActiveFile(null);
        setOpenTabs([]);
      } catch (error) {
        console.error('Error cargando archivos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (windows.codeeditor?.isOpen) {
      loadFiles();
    }
  }, [windows.codeeditor?.isOpen, data?.projectName]);

  useEffect(() => {
    if (!data && windows.codeeditor?.isOpen) {
      closeWindow('codeeditor');
    }
  }, [data, windows.codeeditor?.isOpen, closeWindow]);

  if (!data) return null;

  const handleFileClick = (file) => {
    setActiveFile(file);
    if (!openTabs.find(t => t.name === file.name)) {
      setOpenTabs([...openTabs, file]);
    }
  };

  // ✅ GUARDADO AUTOMATICO Y MANEJO DE CAMBIOS
  const handleEditorChange = (value) => {
    if (!activeFile) return;
    
    setFileContents(prev => ({
      ...prev,
      [activeFile.name]: value
    }));

    // Guardado automatico despues de 2 segundos sin escribir
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      saveFile(activeFile.name, value);
    }, 2000);
  };

  const saveFile = async (fileName, content) => {
    setIsSaving(true);
    try {
      console.log(`💾 Guardando ${fileName}...`);
      
      const response = await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files/${fileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        setLastSaved(new Date());
        console.log(`✅ ${fileName} guardado correctamente!`);
      } else {
        console.error('❌ Error al guardar');
      }
    } catch (error) {
      console.error('❌ Error guardando archivo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ CREAR NUEVO ARCHIVO
  const createNewFile = async () => {
    const name = prompt('Nombre del nuevo archivo:');
    if (!name) return;
    
    try {
      await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: name,
          content: `// ${name}\n\n// Archivo creado nuevo`
        })
      });

      // Recargar lista
      await reloadFiles();
    } catch (error) {
      console.error('❌ Error creando archivo:', error);
    }
  };

  // ✅ ELIMINAR ARCHIVO
  const deleteCurrentFile = async () => {
    if (!activeFile) return;
    if (!confirm(`Eliminar ${activeFile.name}?`)) return;
    
    try {
      await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files/${activeFile.name}`, {
        method: 'DELETE'
      });

      // Cerrar pestaña
      handleCloseTab(activeFile, { stopPropagation: () => {} });
      
      // Recargar lista
      await reloadFiles();
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
    }
  };

  // ✅ RECARGAR ARCHIVOS
  const reloadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files`);
      const files = await response.json();
      setAllFiles(files);
      
      const contents = {};
      files.forEach(f => contents[f.name] = f.content);
      setFileContents(contents);
    } catch (error) {
      console.error('❌ Error recargando:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DESCARGAR ARCHIVO ACTUAL
  const downloadFile = () => {
    if (!activeFile) return;
    
    const content = fileContents[activeFile.name] || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ ABRIR PREVIEW - Con soporte para recursos externos
  const openPreview = async () => {
    if (!activeFile || !activeFile.name.endsWith('.html')) {
      alert('Preview solo disponible para archivos HTML');
      return;
    }
    
    try {
      // Obtener contenido (del estado local o del servidor)
      let content = fileContents[activeFile.name] || activeFile.content || '';
      
      // Si no hay contenido, intentar obtenerlo del servidor
      if (!content) {
        const response = await fetch(`http://localhost:3001/api/projects/${currentProjectName}/files`);
        const files = await response.json();
        const htmlFile = findFileByName(files, activeFile.name);
        content = htmlFile?.content || '';
      }
      
      // Si hay contenido, corregir rutas relativas para recursos
      if (content) {
        // Obtener la ruta base del archivo HTML
        const basePath = activeFile.path?.replace(activeFile.name, '') || '';
        
        // Corregir rutas de CSS y JS
        content = content.replace(/href=["']([^"']+)["']/g, (match, href) => {
          if (href.startsWith('http') || href.startsWith('//')) return match;
          // Ruta absoluta al recurso en el servidor
          const newHref = `http://localhost:3001/api/projects/${currentProjectName}/files/${basePath}${href}`;
          return `href="${newHref}"`;
        });
        
        content = content.replace(/src=["']([^"']+)["']/g, (match, src) => {
          if (src.startsWith('http') || src.startsWith('//')) return match;
          const newSrc = `http://localhost:3001/api/projects/${currentProjectName}/files/${basePath}${src}`;
          return `src="${newSrc}"`;
        });
      }
      
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening preview:', error);
      alert('Error al abrir preview');
    }
  };
  
  // ✅ Función auxiliar para buscar archivo por nombre
  const findFileByName = (files, name) => {
    for (const file of files) {
      if (file.name === name) return file;
      if (file.children) {
        const found = findFileByName(file.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  // ✅ FORMATEAR CODIGO
  const formatCode = async () => {
    if (!editorRef.current) return;
    editorRef.current.getAction('editor.action.formatDocument').run();
  };

  // Guardar manualmente con Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 's' && activeFile) {
        e.preventDefault();
        const content = fileContents[activeFile.name] || getFileContent(activeFile);
        saveFile(activeFile.name, content);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, fileContents]);

  const handleCloseTab = (file, e) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t.name !== file.name);
    setOpenTabs(newTabs);
    
    if (activeFile?.name === file.name && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveFile(null);
    }
  };

  const getFileContent = (file) => {
    if (fileContents[file.name]) {
      return fileContents[file.name];
    }
    if (file.fileType === 'txt') {
      return file.description?.join('\n\n') || file.content || '';
    }
    return file.content || `// ${file.name}\n\n// Archivo vacío`;
  };

  const getFileLanguage = (file) => {
    if (file.fileType === 'txt') return 'markdown';
    if (file.name.endsWith('.js')) return 'javascript';
    if (file.name.endsWith('.jsx')) return 'javascript';
    if (file.name.endsWith('.ts')) return 'typescript';
    if (file.name.endsWith('.tsx')) return 'typescript';
    if (file.name.endsWith('.css')) return 'css';
    if (file.name.endsWith('.html')) return 'html';
    if (file.name.endsWith('.json')) return 'json';
    return 'plaintext';
  };
const extensionMap = {
  js: 'Javascript',
  jsx: 'React',
  ts: 'TypeScript',
  tsx: 'React',
  css: 'CSS',
  html: 'HTML5',
};
const getFileIcon = (file) => {
  if (file.fileType === 'txt') return '📄';
  if (file.fileType === 'img') return '🖼️';

  const ext = file.path.split('.').pop().toLowerCase();
  const tech = extensionMap[ext];

  if (tech) {
    const { icon } = getTechConfig(tech);
    return icon;
  }

  if (ext === 'json') return '📦';

  return '📄';
};

  return (
    <>
      <div id="window-header" className="bgt border-b border-gray-700">
        <WindowControls target="codeeditor" onMaximize={() => setIsMaximized(!isMaximized)} />
        <div className="flex-1 flex items-center justify-center">
          <h2 className='text-sm font-semibold' >
            {projectName}
          </h2>
        </div>
      </div>

      {/* ✅ BARRA DE HERRAMIENTAS */}
      <div className="h-10 bg-[#3c3c3c] border-b border-gray-700 flex items-center px-3 gap-1">
        <div className="flex w-full items-center gap-2">

        <button 
          onClick={() => activeFile && saveFile(activeFile.name, fileContents[activeFile.name])}
          disabled={!activeFile || isSaving}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Guardar (ALT+S)"
        >
          <Save size={12}/>Guardar
        </button>



        <button 
          onClick={createNewFile}
          className="px-2 py-1 text-xs border border-blue-800 bg-blue-900/20 hover:bg-gray-600 rounded text-white flex items-center gap-1"
          title="Nuevo Archivo"
        >
          <CirclePlus size={13} className="text-blue-400"/>
        </button>

        <button 
          onClick={reloadFiles}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-blue-900/20 border border-blue-800 hover:bg-gray-600 rounded text-white disabled:opacity-50 flex items-center gap-1"
          title="Recargar archivos"
        >
          < RefreshCcw size={12} className="text-blue-400"/>
        </button>

        <button 
          onClick={() => {
            // Extraer todas las carpetas del arbol
            const folders = [];
            
            const extractFolders = (items, parent = '') => {
              items.forEach(item => {
                if (item.type === 'folder') {
                  folders.push({ path: item.path, name: item.name });
                  extractFolders(item.children, item.path);
                }
              });
            };
            
            extractFolders(allFiles);
            
            const folderList = ['. (Raiz)', ...folders.map(f => f.path)];
            const selected = prompt(`Selecciona carpeta:\n${folderList.map((f,i) => `${i} - ${f}`).join('\n')}`);
            
            if (selected !== null && selected !== '') {
              const folderIndex = parseInt(selected);
              if (folderIndex >= 0 && folderIndex < folderList.length) {
                const selectedPath = folderIndex === 0 ? '' : folderList[folderIndex];
                setCurrentPath(selectedPath);
                alert(`✅ Carpeta seleccionada: ${folderList[folderIndex]}`);
              }
            }
          }}
          className="px-2 py-1 text-xs bg-orange-400 hover:bg-orange-300 rounded text-white flex items-center gap-1"
          title="Seleccionar carpeta"
        >
          <Folders size={13} />Carpeta
        </button>

        <button 
          onClick={downloadFile}
          disabled={!activeFile}
          className="px-2 py-1 text-xs bg-blue-900/20 border border-blue-800 hover:bg-gray-600 rounded text-white disabled:opacity-50 flex items-center gap-1"
          title="Descargar archivo"
        >
          <Download size={13} className="text-blue-400" />
        </button>
        </div>




        <div className="flex gap-2 ">
        <button 
          onClick={formatCode}
          disabled={!activeFile}
          className="px-2 py-1 text-xs bbg-blue-900/20 border border-blue-800 hover:bg-gray-600 rounded text-white disabled:opacity-50 flex items-center gap-1"
          title="Formatear codigo (Shift+Alt+F)"
        >
          ✨
        </button>

        <button 
          onClick={openPreview}
          disabled={!activeFile}
          className="px-2 py-1 text-xs bg-green-700 hover:bg-green-800 rounded text-white disabled:opacity-50 flex items-center gap-1"
          title="Abrir Preview HTML"
        >
          <Eye size={13} /> Preview
        </button>

        <button 
          onClick={async () => {
            const url = prompt('URL del repositorio Git:');
            if (!url) return;
            
            try {
              await fetch(`http://localhost:3001/api/projects/${currentProjectName}/git/clone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
              });
              await reloadFiles();
              alert('✅ Repositorio clonado correctamente!');
            } catch (e) {
              alert('❌ Error clonando repositorio');
            }
          }}
          className="px-2 py-1 text-xs bg-purple-700 hover:bg-purple-800 rounded text-white flex items-center gap-1"
          title="Clonar repositorio Git"
        >
          <HardDriveDownload size={13}/> Clone
        </button>

        <button 
          onClick={deleteCurrentFile}
          disabled={!activeFile}
          className="px-2 py-1 text-xs bg-red-800 hover:bg-red-700 rounded text-white disabled:opacity-50 flex items-center gap-1 ml-auto"
          title="Eliminar archivo"
        >
          <Trash2 size={13} />
        </button>

        {/* ✅ INDICADOR DE ESTADO */}
        <div className="ml-auto text-xs text-gray-400 flex items-center gap-2">
          {isSaving && <span className="text-yellow-400 animate-pulse">⏳ Guardando...</span>}
          {!isSaving && lastSaved && <span className="text-green-400">✅ Guardado</span>}
          {activeFile && <span className="text-gray-500">{activeFile.name}</span>}
        </div>

        </div>

      </div>

      <div className="flex h-full min-h-0 bg-[#1e1e1e] overflow-hidden">
        {/* Sidebar - Explorador de archivos */}
        <div className="w-64 bg-[#252526] text-gray-300 flex flex-col border-r border-gray-700">
          <div className="p-3 border-b border-gray-700">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Explorador
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 mb-24">
            <div className="text-xs text-gray-500 px-2 py-1 uppercase tracking-wide">
              {projectName}
            </div>

            {/* ✅ BOTON VOLVER ATRAS */}
            {currentPath !== selectedFolder?.path && (
              <button 
                onClick={() => {
                  if (currentPath === selectedFolder?.path) {
                    setSelectedFolder(null);
                    setCurrentPath('');
                  } else {
                    const parentPath = currentPath.split('/').slice(0, -1).join('/');
                    setCurrentPath(parentPath);
                  }
                }}
                className="mx-2 my-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center gap-1 w-full"
              >
                ⬅️ Volver atras
              </button>
            )}

            {selectedFolder && (
              <button 
                onClick={() => {
                  setSelectedFolder(null);
                  setCurrentPath('');
                  setActiveFile(null);
                  setOpenTabs([]);
                }}
                className="mx-2 my-1 px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded text-white flex items-center gap-1 w-full"
              >
                🏠 Cambiar proyecto
              </button>
            )}

            {/* ✅ MIGA DE PAN */}
            {currentPath !== '' && (
              <div className="px-2 py-1 text-xs text-blue-400 border-b border-gray-700 mb-1">
                📂 {currentPath}
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-pulse">⏳ Cargando archivos...</div>
              </div>
            ) : !selectedFolder ? (
              // ✅ SOLO MOSTRAR CARPETAS PRIMER NIVEL DENTRO DE DEMO-PROJECT
              <div className="p-2">
                <div className="text-xs text-gray-400 px-2 mb-3">Selecciona la carpeta para abrir:</div>
                {allFiles.filter(item => item.type === 'folder').map(folder => (
                  <button
                    key={folder.path}
                    onClick={() => {
                      setSelectedFolder(folder);
                      setCurrentPath(folder.path);
                    }}
                    className="w-full mb-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left flex items-center gap-2 text-yellow-400"
                  >
                    <span>📁</span>
                    <span>{folder.name}</span>
                  </button>
                ))}
              </div>
            ) : (
               (() => {
                // Filtrar archivos por ruta actual DENTRO DE LA CARPETA SELECCIONADA
                const items = currentPath === selectedFolder.path ? selectedFolder.children : 
                  (function findPath(items, path) {
                    for (const item of items) {
                      if (item.path === path) return item.children || [];
                      if (item.type === 'folder') {
                        const found = findPath(item.children, path);
                        if (found.length) return found;
                      }
                    }
                    return [];
                  })(selectedFolder.children, currentPath);

                // ✅ ORDENAMIENTO VS CODE: CARPETAS PRIMERO, DESPUES ARCHIVOS
                const sortItems = (items) => {
                  const folders = items.filter(i => i.type === 'folder').sort((a,b) => a.name.localeCompare(b.name));
                  const files = items.filter(i => i.type !== 'folder').sort((a,b) => {
                    // Ordenar archivos por extension y luego nombre
                    const extA = a.name.split('.').pop();
                    const extB = b.name.split('.').pop();
                    if (extA !== extB) return extA.localeCompare(extB);
                    return a.name.localeCompare(b.name);
                  });
                  return [...folders, ...files];
                };

                // ✅ ARBOL RECURSIVO ESTILO VSCODE
                const renderTree = (items, level = 0) => {
                  const sortedItems = sortItems(items);
                  return sortedItems.map(item => {
                    if (item.type === 'folder') {
                      const isExpanded = expandedFolders.has(item.path);
                      return (
                        <div key={item.path} style={{ paddingLeft: `${level * 12}px` }}>
                          <div 
                            className="px-2 py-1.5 cursor-pointer rounded text-sm hover:bg-[#2a2d2e] transition-colors flex items-center gap-2 text-yellow-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedFolders(prev => {
                                const newSet = new Set(prev);
                                if (isExpanded) newSet.delete(item.path);
                                else newSet.add(item.path);
                                return newSet;
                              });
                            }}
                          >
                            <span className="text-sm w-4">{isExpanded ? '🔽' : '▶️'}</span>
                            <span className="text-base">📁</span>
                            <span className="truncate flex-1 text-sm">{item.name}</span>
                          </div>
                          {isExpanded && renderTree(item.children, level + 1)}
                        </div>
                      );
                    }

                    const isActive = activeFile?.name === item.name;
                
                    return (
                      <div 
                        key={item.path}
                        style={{ paddingLeft: `${level * 12}px` }} 
                        className={`px-2 py-1.5 cursor-pointer rounded text-sm hover:bg-[#2a2d2e] transition-colors flex items-center gap-2 ${
                          isActive ? 'bg-[#37373d]' : ''
                        }`}
                        onClick={() => handleFileClick(item)}
                      >
                        <span className="text-base">{getFileIcon(item)}</span>
                        <span className="truncate flex-1 text-sm">{item.name}</span>
                      </div>
                    );
                  });
                };

                return renderTree(items);
              })()
            )}
          </div>
        </div>

        {/* Editor principal */}
        <div className="flex-1 mb-14 flex flex-col min-w-0 mb-24">
          {/* Pestañas */}
          <div className="flex z-10 items-center bg-[#252526] border-b border-gray-700 overflow-x-auto">
            {openTabs.map(file => (
              <div
                key={file.name}
                className={`flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer group min-w-0 ${
                  activeFile?.name === file.name 
                    ? 'bg-[#1e1e1e] text-white' 
                    : 'text-gray-400 hover:bg-[#2a2d2e]'
                }`}
                onClick={() => setActiveFile(file)}
              >
                <span className="text-sm">{getFileIcon(file)}</span>
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={(e) => handleCloseTab(file, e)}
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded p-0.5 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Editor Monaco */}
          {activeFile ? (
            <Editor
              height="100%"
              language={getFileLanguage(activeFile)}
              value={fileContents[activeFile.name] ?? getFileContent(activeFile)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                readOnly: false,
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              onChange={handleEditorChange}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-lg">Selecciona un archivo para empezar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ TERMINAL INTEGRADO */}
      {showTerminal && (
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#1e1e1e] border-t border-gray-700 flex flex-col z-20">
          <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-gray-700">
            <span className="text-xs text-gray-400 font-semibold">🖥️  Terminal</span>
            <button 
              onClick={() => setShowTerminal(false)} 
              className="text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-green-400" ref={terminalRef}>
            {terminalHistory.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}
          </div>
          
          <div className="flex items-center px-2 py-1 bg-[#0d0d0d] border-t border-gray-800">
            <span className="text-green-500 text-xs mr-2">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent text-white text-xs font-mono outline-none"
              placeholder="Escribe un comando..."
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && terminalInput.trim()) {
                  const cmd = terminalInput.trim();
                  setTerminalHistory(prev => [...prev, `$ ${cmd}`]);
                  setTerminalInput('');

                  // ✅ MANEJO DE COMANDO CD LOCAL
                  if (cmd.startsWith('cd ')) {
                    const newPath = cmd.substring(3).trim();
                    if (newPath === '..') {
                      const parent = terminalWorkingDir.split('/').slice(0, -1).join('/');
                      setTerminalWorkingDir(parent);
                      setTerminalHistory(prev => [...prev, `✅ Carpeta cambiada: ${parent || '/'}`]);
                    } else {
                      setTerminalWorkingDir(terminalWorkingDir ? `${terminalWorkingDir}/${newPath}` : newPath);
                      setTerminalHistory(prev => [...prev, `✅ Carpeta cambiada: ${newPath}`]);
                    }
                    setTimeout(() => terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight), 10);
                    return;
                  }

                  // ✅ COMANDO PWD
                  if (cmd === 'pwd') {
                    setTerminalHistory(prev => [...prev, terminalWorkingDir || '/ (raiz)']);
                    setTimeout(() => terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight), 10);
                    return;
                  }
                  
                  try {
                    const res = await fetch('http://localhost:3001/api/terminal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        command: cmd, 
                        project: selectedFolder ? selectedFolder.path : currentProjectName,
                        cwd: terminalWorkingDir
                      })
                    });
                    const data = await res.json();
                    setTerminalHistory(prev => [...prev, data.output || '']);
                  } catch (err) {
                    setTerminalHistory(prev => [...prev, `❌ Error conectando con servidor`]);
                  }
                  
                  setTimeout(() => terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight), 10);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ BOTON TERMINAL FIJO */}
      {!showTerminal && (
        <button
          onClick={() => setShowTerminal(true)}
          className="absolute flex items-center gap-2 bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs shadow-lg z-10"
        >
          <Terminal size={13} />  Abrir Terminal
        </button>
      )}
    </>
  );
};

const CodeEditorWindow = WindowWrapper(CodeEditor, "codeeditor");
export default CodeEditorWindow;
