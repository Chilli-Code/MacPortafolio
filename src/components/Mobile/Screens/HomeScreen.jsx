import { screenApps } from '#constants/index.js';

const HomeScreen = ({ onAppClick }) => {
  // Filtrar solo las apps principales (sin el juego)
  const apps = screenApps.filter(app => app.id !== 'game' && app.canOpen);

  return (
    <div className="grid grid-cols-4 gap-6 px-6 py-8">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden ">
            <img
              src={`/images/${app.icon}`}
              alt={app.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <span className="text-white text-xs font-medium text-center">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default HomeScreen;