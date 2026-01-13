import { useState } from 'react';
import { ChevronLeft, Search, Folder, FileText, Image, File, Globe, Figma } from '#assets/icons';
import { locations } from '#constants/index.js';

const FinderScreen = ({ onBack }) => {
  const workLocation = locations.work || { name: 'Work', children: [] };
  
  const [currentFolder, setCurrentFolder] = useState(workLocation);
  const [folderHistory, setFolderHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFolderClick = (item) => {
    if (item.kind === 'folder') {
      setFolderHistory([...folderHistory, currentFolder]);
      setCurrentFolder(item);
    } else {
      // Abrir archivo según tipo
      handleFileOpen(item);
    }
  };

  const handleFileOpen = (file) => {
    console.log('Abrir archivo:', file.name, file.fileType);
    
    // Lógica según tipo de archivo
    switch (file.fileType) {
      case 'url':
        if (file.href) {
          window.open(file.href, '_blank');
        }
        break;
      case 'img':
        // Aquí puedes abrir un modal con la imagen
        console.log('Mostrar imagen:', file.imageUrl);
        break;
      case 'txt':
        // Aquí puedes abrir un modal con el texto
        console.log('Mostrar texto:', file.description);
        break;
      case 'fig':
        if (file.href) {
          window.open(file.href, '_blank');
        }
        break;
      default:
        console.log('Tipo de archivo no soportado');
    }
  };

  const handleGoBack = () => {
    if (folderHistory.length > 0) {
      const newHistory = [...folderHistory];
      const previousFolder = newHistory.pop();
      setCurrentFolder(previousFolder);
      setFolderHistory(newHistory);
    } else {
      onBack?.();
    }
  };

  const getFileIcon = (item) => {
    if (item.kind === 'folder') {
      return <img src='/images/folderMobile.svg' width={70} height={70} draggable={false} alt='Folders'  className="no-download text-[#32ADE6] object-cover" />;
    }
    
    switch (item.fileType) {
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-700" />;
      case 'img':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'url':
        return <Globe className="w-8 h-8 text-blue-500" />;
      case 'fig':
        return <Figma className="w-8 h-8 text-purple-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const getThumbnail = (item) => {
    // Si tiene imageUrl, usarla
    if (item.imageUrl) {
      return item.imageUrl;
    }
    // Si tiene icon personalizado
    if (item.icon) {
      return item.icon;
    }
    return null;
  };

  const items = currentFolder.children || [];
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-blue-500 font-normal text-base active:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          Go back
        </button>
        
        <h1 className="text-base text-center font-semibold text-gray-900 dark:text-white">
          {currentFolder.name}
        </h1>
        
        <button 
          onClick={onBack}
          className="text-blue-500 font-normal text-base active:opacity-50"
        >
          Cancel
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const thumbnail = getThumbnail(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleFolderClick(item)}
                className="flex flex-col items-center gap-2 active:opacity-50 transition-opacity"
              >
                {/* Icon/Thumbnail */}
                {item.kind === 'folder' ? (
                  <div className="w-full aspect-square flex items-center justify-center">
                    {getFileIcon(item)}
                  </div>
                ) : thumbnail ? (
                  <div className="w-full aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {getFileIcon(item)}
                  </div>
                )}
                
                {/* Name */}
                <div className="text-center w-full">
                  <p className="text-xs text-gray-900 dark:text-white font-normal break-words text-pretty line-clamp-2">
                    {item.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No results found' : 'This folder is empty'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 py-2 text-blue-500">
            <Folder className="w-6 h-6" />
            <span className="text-xs font-medium">Work</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <FileText className="w-6 h-6" />
            <span className="text-xs font-medium">About Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinderScreen;
