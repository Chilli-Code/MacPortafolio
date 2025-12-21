// /components/Profile/sections/GeneralSection.jsx

import { 
  CheckCircle, DollarSign, Clock, Briefcase, 
  Code, Zap, Award, MapPin, Globe,
  Coffee, Users, MessageCircle, Star, Settings
} from '#assets/icons';
import StatsCard from '../components/StatsCard';
import EditProfileModal from '../components/EditProfileModal';
import ProgressBar from '../components/ProgressBar';
import { useState } from "react";
import { USER_DATA } from '#constants'; // ⭐ Importar

const GeneralSection = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(USER_DATA.profile);

  // ⭐ Extraer datos de USER_DATA
  const { profile, stats, skills, progression, badges, professional } = USER_DATA;

  const handleSaveProfile = (newData) => {
    setProfileData(newData);
    console.log('Datos guardados:', newData);
  };

  // Status combinado
  const status = {
    online: true,
    activity: "Trabajando en proyecto Nike",
    ...profileData
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-2 right-4 p-1 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all shadow-md group cursor-pointer"
          title="Editar perfil"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 relative">

        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0 mx-auto lg:mx-0">
            <img
              draggable={false}
              src={profile.avatar}
              alt={profile.fullName}
              className="w-32 h-32 rounded-2xl object-cover shadow-2xl ring-4 ring-white dark:ring-gray-700"
            />
            {status.online && (
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Online
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.fullName}
              </h1>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-md">
                {progression.rankIcon} Nivel {progression.level}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stats.averageRating}
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💼 {profile.role.toUpperCase()} · {progression.rank}
            </p>

            <div className="flex flex-wrap gap-3 mb-4 text-xs">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Coffee className="w-4 h-4" />
                <span>{status.activity}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <button type='button' className="flex cursor-pointer bg-green-200/30 p-2 rounded-xl items-center gap-1 text-green-600 dark:text-green-400 hover:bg-green-200/50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Iniciar conversación</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 mt-5">
          <ProgressBar 
            label={`${progression.currentXP.toLocaleString()} XP / ${progression.xpForNextLevel.toLocaleString()} XP para Nivel ${progression.level + 1}`}
            current={progression.currentXP}
            total={progression.xpForNextLevel}
            color="purple"
          />
        </div>

        {/* Bio */}
        <div className='overflow-hidden w-full'>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-scroll">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Code className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Habilidades Técnicas
          </h3>
        </div>
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {skills.map((skill) => (
            <ProgressBar
              key={skill.name}
              label={`${skill.icon} ${skill.name}`}
              current={skill.level}
              total={100}
              color={skill.color.slice(1)}
            />

          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        <StatsCard
          icon={CheckCircle}
          value={stats.tasksCompleted}
          label="Tareas Completadas"
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
        <StatsCard
          icon={DollarSign}
          value={`$${stats.totalEarnings.toLocaleString()}`}
          label="Ganancias Totales"
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          icon={Clock}
          value={`${stats.hoursWorked}h`}
          label="Horas Trabajadas"
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatsCard
          icon={Briefcase}
          value={stats.projectsCompleted}
          label="Proyectos Finalizados"
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Additional Info */}
      <div 
        className="grid gap-4 mb-10"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {/* Disponibilidad */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estado</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {professional.availability}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>{profile.timezone}</span>
          </div>
        </div>

        {/* Comunidad */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Comunidad</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Conecta con otros devs</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full ring-2 ring-white dark:ring-gray-800"
                title={`Developer ${i}`}
              />
            ))}
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">+24</span>
            </div>
          </div>
        </div>

        {/* Reconocimientos */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reconocimientos</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {badges.length} medallas desbloqueadas
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {badges.slice(0, 4).map((badge) => (
              <div key={badge.id} className="text-2xl" title={badge.name}>
                {badge.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default GeneralSection;