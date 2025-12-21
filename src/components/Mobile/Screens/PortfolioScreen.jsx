import { useState } from 'react';
import { ChevronLeft, Search, Folder, FileText, Image, File } from 'lucide-react';

// Simulación de datos (reemplaza con tus locations reales)
const workFolder = {
  id: 'work',
  name: 'Work',
  type: 'folder',
  children: [
    {
      id: 'project1',
      name: 'Project 1',
      subtitle: '(SnapCast)',
      type: 'folder',
      children: []
    },
    {
      id: 'project2',
      name: 'Project 2',
      subtitle: '(Converso)',
      type: 'folder',
      children: []
    },
    {
      id: 'project3',
      name: 'Project 3',
      subtitle: '(PrepWise)',
      type: 'folder',
      children: []
    },
    {
      id: 'resume',
      name: 'Resume.pdf',
      type: 'file',
      fileType: 'pdf',
      thumbnail: '/api/placeholder/60/80'
    }
  ]
};

const PortfolioScreen = ({ onBack }) => {
  const [currentFolder, setCurrentFolder] = useState(workFolder);
  const [folderHistory, setFolderHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFolderClick = (folder) => {
    if (folder.type === 'folder') {
      setFolderHistory([...folderHistory, currentFolder]);
      setCurrentFolder(folder);
    } else {
      // Abrir archivo
      console.log('Abrir archivo:', folder.name);
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
    if (item.type === 'folder') {
      return <Folder className="w-full h-full text-[#32ADE6]" fill="#32ADE6" />;
    }
    
    switch (item.fileType) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredItems = currentFolder.children.filter(item =>
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
        
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          {currentFolder.name}
        </h1>
        
        <button className="text-blue-500 font-normal text-base active:opacity-50">
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
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleFolderClick(item)}
              className="flex flex-col items-center gap-2 active:opacity-50 transition-opacity"
            >
              {/* Icon/Thumbnail */}
              {item.type === 'folder' ? (
                <div className="w-full aspect-square flex items-center justify-center">
                  {getFileIcon(item)}
                </div>
              ) : item.thumbnail ? (
                <div className="w-full aspect-[3/4] bg-white rounded-lg shadow-sm overflow-hidden">
                  <img
                    src={item.thumbnail}
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
                <p className="text-xs text-gray-900 dark:text-white font-normal truncate">
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </button>
          ))}
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

      {/* Bottom Tabs (opcional) */}
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

// Demo Component
const App = () => {
  const [showPortfolio, setShowPortfolio] = useState(true);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-400">
      {showPortfolio ? (
        <div className="h-full max-w-md mx-auto">
          <PortfolioScreen onBack={() => setShowPortfolio(false)} />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={() => setShowPortfolio(true)}
            className="bg-white px-6 py-3 rounded-xl shadow-lg text-gray-900 font-semibold"
          >
            Open Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default App;