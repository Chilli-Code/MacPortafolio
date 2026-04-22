// src/windows/CodeEditor.jsx
import { useState, useEffect, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/Desktop/WindowControls';
import useWindowStore from '#store/window';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ isMaximized, setIsMaximized }) => {
  const { windows, closeWindow } = useWindowStore();
  const data = windows.codeeditor?.data;
  const editorRef = useRef(null);

  const folderFiles = data?.folderFiles || [];
  const projectName = data?.projectName || 'Proyecto';

  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [fileContents, setFileContents] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (!data && windows.codeeditor?.isOpen) {
      closeWindow('codeeditor');
    }
  }, [data, windows.codeeditor?.isOpen, closeWindow]);

  useEffect(() => {
    if (folderFiles.length > 0 && !activeFile) {
      const firstFile = folderFiles[0];
      setActiveFile(firstFile);
      setOpenTabs([firstFile]);
    }
  }, [folderFiles, activeFile]);

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
      // TODO: Implementar API real aqui
      console.log(`💾 Guardando ${fileName}...`);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLastSaved(new Date());
      console.log(`✅ ${fileName} guardado!`);
    } catch (error) {
      console.error('❌ Error guardando archivo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar manualmente con Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && activeFile) {
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

  const getFileIcon = (file) => {
    if (file.fileType === 'txt') return '📄';
    if (file.fileType === 'img') return '🖼️';
    if (file.name.endsWith('.js')) return '📜';
    if (file.name.endsWith('.jsx')) return '⚛️';
    if (file.name.endsWith('.tsx')) return '⚛️';
    if (file.name.endsWith('.css')) return '🎨';
    if (file.name.endsWith('.html')) return '🌐';
    if (file.name.endsWith('.json')) return '📦';
    return '📄';
  };

  return (
    <>
      <div id="window-header" className="bgt border-b border-gray-700">
        <WindowControls target="codeeditor" onMaximize={() => setIsMaximized(!isMaximized)} />
        <div className="flex-1 flex items-center justify-center">
          <h2 className='text-sm font-semibold'>
            {projectName}
          </h2>
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
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs text-gray-500 px-2 py-1 uppercase tracking-wide">
              {projectName}
            </div>
            {folderFiles.map(file => {
              const isActive = activeFile?.name === file.name;
              
              return (
                <div 
                  key={file.name} 
                  className={`px-2 py-1.5 cursor-pointer rounded text-sm hover:bg-[#2a2d2e] transition-colors flex items-center gap-2 ${
                    isActive ? 'bg-[#37373d]' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <span className="text-base">{getFileIcon(file)}</span>
                  <span className="truncate flex-1 text-sm">{file.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor principal */}
        <div className="flex-1 mb-14 flex flex-col min-w-0">
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
                readOnly: false, // Aquí puedes poner lógica de permisos
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
    </>
  );
};

const CodeEditorWindow = WindowWrapper(CodeEditor, "codeeditor");
export default CodeEditorWindow;