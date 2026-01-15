import {
  MapPin, Mail, Phone, Globe, Code,
  CheckCircle, DollarSign, Clock, Briefcase
} from '#assets/icons';

import MobileNav from '#components/Mobile/MobileNav';
import { useAuthStore } from '#store/authStore';
import {
  useGamificationStats,
  useSkills
} from '#hooks/useGamification';

const GeneralSectionMobile = ({ onBack }) => {
  const currentUser = useAuthStore(state => state.currentUser);
  const stats = useGamificationStats();
  const skills = useSkills();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  const {
    level = 1,
    rankIcon = '🌱',
    currentXP = 0,
    xpToNextLevel = 1000,
    tasksCompleted = 0,
    totalEarnings = 0,
    totalHoursWorked = 0,
    projectsCompleted = 0,
    averageRating = 0
  } = stats || {};

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">

      <MobileNav title="Mi Perfil" onBack={onBack} showCancel={false} />

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-24 h-24 rounded-2xl ring-4 ring-white/50 object-cover"
              draggable={false}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {currentUser.fullName}
              </h1>
              <p className="text-sm text-white/90 mb-2">
                💼 {(currentUser.type || currentUser.role).toUpperCase()}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  {rankIcon} Nivel {level}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  ⭐ {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Nivel {level}</span>
              <span>{currentXP}/{xpToNextLevel} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${(currentXP / xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 py-4 bg-white dark:bg-gray-800 mt-4 mx-4 rounded-2xl">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {currentUser.profile?.bio || 'Sin biografía'}
          </p>
        </div>

        {/* Stats */}
        <div className="px-4 mt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={CheckCircle} value={tasksCompleted} label="Tareas" color="green" />
            <StatCard icon={DollarSign} value={`$${totalEarnings.toLocaleString()}`} label="Ganancias" color="blue" />
            <StatCard icon={Clock} value={`${totalHoursWorked}h`} label="Horas" color="orange" />
            <StatCard icon={Briefcase} value={projectsCompleted} label="Proyectos" color="purple" />
          </div>
        </div>

        {/* Skills */}
        <div className="px-4 mt-6 pb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Habilidades
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-3">
            {skills?.map(skill => (
              <div key={skill}>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {skill}
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="px-4 pb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Contacto
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y">
            <InfoRow icon={MapPin} label="Ubicación" value={currentUser.profile?.location} />
            <InfoRow icon={Mail} label="Email" value={currentUser.email} />
            <InfoRow icon={Phone} label="Teléfono" value={currentUser.phone} />
            <InfoRow icon={Globe} label="Web" value={currentUser.website} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSectionMobile;
