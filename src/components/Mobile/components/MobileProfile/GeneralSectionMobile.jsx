import { MapPin, Mail, Phone, Globe, Code, CheckCircle, DollarSign, Clock, Briefcase } from '#assets/icons';

import { USER_DATA } from '#constants';
import MobileNav from '#components/Mobile/MobileNav';

const GeneralSectionMobile = ({ onBack }) => {
  const { profile, stats, skills, progression } = USER_DATA;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      <MobileNav
        title="Mi Perfil"
        onBack={onBack}
        showCancel={false}
        />
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-24 h-24 rounded-2xl ring-4 ring-white/50 object-cover"
              draggable={false}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{profile.fullName}</h1>
              <p className="text-sm text-white/90 mb-2">💼 {profile.role.toUpperCase()}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {progression.rankIcon} Nivel {progression.level}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  ⭐ {stats.averageRating}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Nivel {progression.level}</span>
              <span>{progression.currentXP}/{progression.xpForNextLevel} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${(progression.currentXP / progression.xpForNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 py-4 bg-white dark:bg-gray-800 mt-4 mx-4 rounded-2xl">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="px-4 mt-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
            Estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={CheckCircle} value={stats.tasksCompleted} label="Tareas" color="green" />
            <StatCard icon={DollarSign} value={`$${stats.totalEarnings.toLocaleString()}`} label="Ganancias" color="blue" />
            <StatCard icon={Clock} value={`${stats.hoursWorked}h`} label="Horas" color="orange" />
            <StatCard icon={Briefcase} value={stats.projectsCompleted} label="Proyectos" color="purple" />
          </div>
        </div>

        {/* Skills */}
        <div className="px-4 mt-6 pb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Habilidades
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-3">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {skill.icon} {skill.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${skill.color}`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-4 pb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
            Contacto
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y divide-gray-200 dark:divide-gray-700">
            <InfoRow icon={MapPin} label="Ubicación" value={profile.location} />
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <InfoRow icon={Phone} label="Teléfono" value={profile.phone} />
            <InfoRow icon={Globe} label="Sitio Web" value={profile.website} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <Icon className={`w-5 h-5 ${colors[color]} mb-2`} />
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

export default GeneralSectionMobile;