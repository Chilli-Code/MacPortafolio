// /components/Profile/sections/GeneralSection.jsx
import { useState, useEffect } from "react";

import {
  CheckCircle, DollarSign, Clock, Briefcase,
  Code, Zap, Award, MapPin, Globe,
  Coffee, Users, MessageCircle, Star, Settings
} from '#assets/icons';
import { useAuthStore } from '#store/authStore';
import {
  useGamificationStats,
  useSkills,
  useStreak
} from '#hooks/useGamification';
import { getTechConfig } from '#assets/techIcons/techConfig';
import StatsCard from '../components/StatsCard';
import EditProfileModal from '../components/EditProfileModal';
import ProgressBar from '../components/ProgressBar';


const MAC_COLORS = [
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-indigo-400 to-indigo-600',
  'bg-gradient-to-br from-emerald-400 to-emerald-600',
  'bg-gradient-to-br from-cyan-400 to-cyan-600',
  'bg-gradient-to-br from-orange-400 to-orange-600',
];

const getAvatarColor = (name = '') => {
  if (!name) return MAC_COLORS[0];
  const code = name.charCodeAt(0);
  return MAC_COLORS[code % MAC_COLORS.length];
};

const Avatar = ({ name, src }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = getAvatarColor(name);

  if (src) {
    return (
      <img
        draggable={false}
        src={src}
        alt={name}
        className="w-25 h-25 rounded-2xl object-cover shadow-2xl ring-4 ring-white dark:ring-gray-700 transition-transform duration-300 hover:scale-105"
      />
    );
  }

  return (
    <div
      className={`
        w-28 h-28 rounded-full
        ${bgColor}
        flex items-center justify-center
        shadow-2xl ring-4 ring-white dark:ring-gray-700
        select-none
      `}
    >
      <span className="text-5xl font-semibold text-white tracking-tight">
        {initial}
      </span>
    </div>
  );
};



const GeneralSection = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ⭐ DATOS REALES DEL USUARIO
  const currentUser = useAuthStore(state => state.currentUser);
  const updateUser = useAuthStore(state => state.updateUser);



  const stats = useGamificationStats();
  const skills = useSkills();
  const currentStreak = useStreak();
  // ⭐ DEBUG: Ver qué datos tenemos
  // Si no hay usuario, mostrar loading
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

const handleSaveProfile = async (newData) => {
  await updateUser(currentUser.id, {
    fullName: newData.fullName,
    role: newData.role,

    profile: {
      ...currentUser.profile,
      bio: newData.bio,
      location: newData.location,
    },

    skills: newData.skills,
  });
};


  const {
    level = 1,
    rank = 'Novato',
    rankIcon = '🌱',
    currentXP = 0,
    xpToNextLevel = 1000,
    tasksCompleted = 0,
    totalEarnings = 0,
    totalHoursWorked = 0,
    projectsCompleted = 0,
    averageRating = 0,
    badges = []
  } = stats || {};







  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br overflow-hidden from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 relative">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-2 right-4 p-1 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all shadow-md group cursor-pointer"
          title="Editar perfil"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0 mx-auto lg:mx-0">
            <Avatar
              name={currentUser.fullName}
              src={currentUser.avatar}
            />
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Online
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentUser.fullName}
              </h1>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-md">
                {rankIcon} Nivel {level}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stats.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>

            <p className="flex gap-2 items-center justify-start text-sm text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase size={20} /> {(currentUser.type || currentUser.role).toUpperCase()} · {rank}
            </p>
            <p className="text-sm text-blue-500 dark:text-blue-600 mb-2">
              @{currentUser.username}
            </p>

            <div className="flex flex-wrap gap-3 mb-4 text-xs">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Coffee className="w-4 h-4" />
                <span>Trabajando en proyectos</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.profile?.location || 'Ubicación no especificada'}</span>
              </div>
              <button type='button' className="flex cursor-pointer bg-green-200/30 p-2 rounded-xl items-center gap-1 text-green-600 dark:text-green-400 hover:bg-green-200/50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Iniciar conversación</span>
              </button>
            </div>
          </div>
          {/* Bio */}
          <div className='overflow-hidden w-full'>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentUser.profile?.bio || 'Desarrollador apasionado por crear experiencias únicas'}
            </p>
          </div>
        </div>

        {/* Progress Bar XP - ARREGLADO */}
        <div className="mb-4 mt-5 ">
          <ProgressBar
            label={
              <div className="flex items-center gap-2">
                <span>{rankIcon}</span>
                <span>Nivel {level} · {rank}</span>
              </div>
            }
            current={currentXP}
            total={xpToNextLevel}
            isLevelBar
            height="h-3"
            animate
          />
        </div>

      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Code className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Habilidades Técnicas
          </h3>
        </div>
        <div className="grid gap-4 overflow-x-scroll"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
{skills?.map((skill) => {
  const tech = getTechConfig(skill);

  return (
    <ProgressBar
      key={skill}
      label={
        <div className="flex items-center gap-2">
          {tech?.icon ?? <span>📚</span>}
          <span>{skill}</span>
        </div>
      }
      current={0}
      total={100}
      gradient={tech?.color}
      animate
    />
  );
})}

        </div>
      </div>



      {/* Stats Cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        <StatsCard
          icon={CheckCircle}
          value={stats.tasksCompleted || 0}
          label="Tareas Completadas"
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
        <StatsCard
          icon={DollarSign}
          value={`$${(stats.totalEarnings || 0).toLocaleString()}`}
          label="Ganancias Totales"
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          icon={Clock}
          value={`${stats.totalHoursWorked || 0}h`}
          label="Horas Trabajadas"
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatsCard
          icon={Briefcase}
          value={stats.projectsCompleted || 0}
          label="Proyectos Finalizados"
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Additional Info */}
      <div
        className="grid gap-4 mb-14"
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
                Disponible para proyectos
              </p>
            </div>
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
          {badges.length > 0 ? (
            <div className="flex gap-1">
              {badges.slice(0, 4).map((badge, idx) => (
                <div key={badge.id || idx} className="text-2xl" title={badge.name}>
                  {badge.icon}
                </div>
              ))}
              {badges.length > 4 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 self-center ml-1">
                  +{badges.length - 4} más
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Completa tareas para desbloquear medallas
            </p>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={currentUser.profile || {}}
        onSave={handleSaveProfile}
      />
    </div>
  );
};



export default GeneralSection;
