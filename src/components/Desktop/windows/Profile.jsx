import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import { profileLinks } from "#constants";
import { useState } from "react";
import { Search } from "#assets/icons";
import { useAchievements } from '#hoc/useAchievements';
// Importar componentes - CORREGIDO
import ProfileSidebar from "#Desktop/components/Profile/ProfileSidebar";
import GeneralSection from "#Desktop/components/Profile/section/GeneralSection";
import StatisticsSection from "#Desktop/components/Profile/section/StatisticsSection"; // CAMBIADO AQUÍ
import AchievementsSection from "#Desktop/components/Profile/section/AchievementsSection";
import ActivitySection from "#Desktop/components/Profile/section/ActivitySection";
import FinancesSection from "#Desktop/components/Profile/section/FinancesSection";
import ProjectsSection from "#Desktop/components/Profile/section/ProjectsSection";

// Importar datos
import { userStats, monthlyData, projectsByCategory } from "#Desktop/components/Profile/utils/profileData";

const Profile = ({ isMaximized, setIsMaximized }) => {

// NOTIFACCIONES PRUEBAS
    const { showLevelUp, showTaskComplete, showMilestone } = useAchievements();

  const handleCompleteTask = (taskName) => {
    // Tu lógica aquí...
    
    // Mostrar notificación
    showTaskComplete(taskName, 50);
  };

  const handleLevelUp = (newLevel) => {
    // Tu lógica aquí...
    
    // Mostrar notificación
    showLevelUp(newLevel, 100);
  };

  const handleMilestone = () => {
    showMilestone(
      {
        title: '50 Proyectos Completados',
        description: '¡Has completado 50 proyectos exitosamente!',
        xp: 500
      },
      {
        current: 50,
        total: 50
      }
    );
  };




  const [activeItem, setActiveItem] = useState(profileLinks[0]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Mapeo de secciones
  const renderContent = () => {
    const sections = {
      1: <GeneralSection />,
      2: <StatisticsSection userStats={userStats} monthlyData={monthlyData} projectsByCategory={projectsByCategory} />,
      3: <AchievementsSection userStats={userStats} />,
      4: <ActivitySection userStats={userStats} />,
      5: <FinancesSection userStats={userStats} monthlyData={monthlyData} />,
      6: <ProjectsSection userStats={userStats} projectsByCategory={projectsByCategory} />
      
    };

    return sections[activeItem.id] || sections[1];
  };

  return (
    <>
      <div id="window-header-mt" className="flex w-full justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg resize-handle">
        <div className="h-full w-40 px-6">
          <WindowControls target="profile" onMaximize={handleMaximize} />
        </div>
        <div className="flex-1 min-w-0 overflow-x-hidden">
          <div id="window-header" className="flex w-full justify-between border-l border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-1 w-full justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                {activeItem.title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    <div>
      {/* Botones de prueba */}
    </div>
      <div className="bg-white dark:bg-gray-900 flex h-full overflow-hidden">
        {/* Sidebar */}
        <ProfileSidebar
          items={profileLinks}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
      <button onClick={() => showLevelUp(9, 100)}>
        Subir a Nivel 9
      </button>
      <button onClick={() => showTaskComplete('Diseño UI completado', 50)}>
        Completar Tarea
      </button>
      <button onClick={handleMilestone}>
        Mostrar Hito
      </button>
          <div className="max-w-full mx-2">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileWindow = WindowWrapper(Profile, "profile");

export default ProfileWindow;