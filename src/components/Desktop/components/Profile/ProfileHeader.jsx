// components/Profile/ProfileHeader.jsx
import { Search } from "#assets/icons";
import { WindowControls } from "#components/Desktop";

const ProfileHeader = ({ isMaximized, setIsMaximized }) => {
    const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="flex w-full justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg resize-handle resize-handle">
      <div className="h-full w-48 px-6">
        <WindowControls target="profile" onMaximize={handleMaximize} />
      </div>

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <div className="flex w-full justify-between border-l px-4 py-3">
          <h1 className="text-sm font-semibold">{activeItem.title}</h1>
          <Search className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
