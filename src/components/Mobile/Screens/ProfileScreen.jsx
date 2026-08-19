import { useState } from 'react';
import { ChevronRight, User, DollarSign, Trophy, ChartColumnBig, Clock, Briefcase } from '#assets/icons';


// Importar secciones
import GeneralSectionMobile from '#components/Mobile/components/MobileProfile/GeneralSectionMobile';
import FinancesSectionMobile from '#components/Mobile/components/MobileProfile/FinancesSectionMobile';
import MobileNav from '../MobileNav';
import AchievementsSectionMobile from '#components/Mobile/components/MobileProfile/AchievementsSectionMobile';
import ActivitySectionMobile from '#components/Mobile/components/MobileProfile/ActivitySectionMobile';
import StatisticsSectionMobile from '#components/Mobile/components/MobileProfile/StatisticsSectionMobile';
import ProjectsSectionMobile from '#components/Mobile/components/MobileProfile/ProjectsSectionMobile';


const ProfileScreen = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState(null);

  const profileSections = [
    {
      id: 'general',
      title: 'Mi Perfil',
      subtitle: 'Información personal y estadísticas',
      icon: User,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    {
      id: 'finances',
      title: 'Finanzas',
      subtitle: 'Ganancias e historial de pagos',
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-100'
    },
    {
      id: 'achievements',
      title: 'Logros',
      subtitle: 'Medallas y reconocimientos',
      icon: Trophy,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100'
    },
    {
      id: 'activity',
      title: 'Actividad',
      subtitle: 'Informacion de su actividad',
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100'
    },
    {
      id: 'estadistic',
      title: 'Estadisticas',
      subtitle: 'Informacion mensual de sus estadisticas',
      icon: ChartColumnBig,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100'
    },
    {
      id: 'projects',
      title: 'Proyectos',
      subtitle: 'Proyectos completados y ganancias',
      icon: Briefcase,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    }
  ];

  const renderSection = () => {
    const handleClose = () => setActiveSection(null);

    switch (activeSection) {
      case 'general':
        return <GeneralSectionMobile onBack={handleClose} />;
      case 'finances':
        return <FinancesSectionMobile onBack={handleClose} />;
      case 'achievements':
        return <AchievementsSectionMobile onBack={handleClose} />;
      case 'activity':
        return <ActivitySectionMobile onBack={handleClose} />;
      case 'estadistic':
        return <StatisticsSectionMobile onBack={handleClose} />;
      case 'projects':
        return <ProjectsSectionMobile onBack={handleClose} />;
        default:
        return null;
    }
  };

  if (activeSection) {
    return renderSection();
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <MobileNav 
        title="Perfil"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/images/jorge-2.jpg"
              alt="Profile"
              className="w-20 h-20 rounded-full ring-4 ring-white/50 object-cover"
              draggable={false}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Jorge</h2>
              <p className="text-sm text-white/90">Frontend Developer</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  🔥 Nivel 12
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  ⭐ 4.9
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold mb-1">47</p>
              <p className="text-xs text-white/80">Tareas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold mb-1">$12.5K</p>
              <p className="text-xs text-white/80">Ganancias</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold mb-1">320h</p>
              <p className="text-xs text-white/80">Horas</p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="mt-6">
          <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Información
          </h3>
          
          <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            {profileSections.map((section, index) => {
              const Icon = section.icon;
              const isLast = index === profileSections.length - 1;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-700 transition-colors ${
                    !isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${section.bg} dark:opacity-80 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;