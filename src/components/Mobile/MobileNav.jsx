import { ChevronLeft } from 'lucide-react';

const MobileNav = ({ 
  title, 
  onBack, 
  onCancel, 
  showCancel = true,
  rightButton = null 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-blue-500 font-normal text-base active:opacity-50 min-w-[70px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Go back
      </button>
      
      <h1 className="text-base text-center font-semibold text-gray-900 dark:text-white flex-1">
        {title}
      </h1>
      
      {rightButton ? (
        rightButton
      ) : showCancel ? (
        <button 
          onClick={onCancel || onBack}
          className="text-blue-500 font-normal text-base active:opacity-50 min-w-[70px] text-right"
        >
          Cancel
        </button>
      ) : (
        <div className="min-w-[70px]" />
      )}
    </div>
  );
};

export default MobileNav;