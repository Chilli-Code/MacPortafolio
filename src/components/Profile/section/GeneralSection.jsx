// /components/Profile/sections/GeneralSection.jsx


import { 
  CheckCircle, DollarSign, Clock, Briefcase, 
  Code, Palette, Zap, Award, MapPin, Globe,
  Coffee, Users, MessageCircle, Star, Settings
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import EditProfileModal from '../components/EditProfileModal';
import { useState, useEffect } from "react";


const GeneralSection = ({ userStats }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(userStats.profile);


    const handleSaveProfile = (newData) => {
    setProfileData(newData);
    // Aquí puedes hacer la llamada a tu API para guardar
    console.log('Datos guardados:', newData);
  };
  // Skills del usuario
  const skills = [
    { name: "React", level: 95, color: "bg-blue-500", icon: "⚛️" },
    { name: "Next.js", level: 90, color: "bg-gray-900", icon: "▲" },
    { name: "TypeScript", level: 88, color: "bg-blue-600", icon: "📘" },
    { name: "UI/UX Design", level: 85, color: "bg-purple-500", icon: "🎨" },
    { name: "Node.js", level: 82, color: "bg-green-600", icon: "🟢" },
    { name: "Tailwind CSS", level: 92, color: "bg-cyan-500", icon: "💨" },
    { name: "GraphQL", level: 78, color: "bg-pink-500", icon: "◈" },
    { name: "MongoDB", level: 80, color: "bg-green-500", icon: "🍃" }
  ];

  // Datos para el juego/plataforma
  const status = {
    online: true,
    activity: "Trabajando en proyecto Nike",
    ...profileData
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - Perfil y Bio */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all shadow-md group cursor-pointer"
          title="Editar perfil"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar con estado online */}
          <div className="relative flex-shrink-0 mx-auto lg:mx-0">
            <img
              draggable={false}
              src="/images/jorge-2.jpg"
              alt="Jorge"
              className="w-32 h-32 rounded-2xl object-cover shadow-2xl ring-4 ring-white dark:ring-gray-700"
            />
            {/* Indicador online */}
            {status.online && (
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Online
              </div>
            )}
          </div>

          {/* Info principal */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jorge</h1>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-md">
                ⚡ Nivel {userStats.level}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {userStats.averageRating}
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💼 Desarrollador Web Full Stack · Freelancer Profesional
            </p>

            {/* Estado actual y ubicación */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Coffee className="w-4 h-4" />
                <span>{status.activity}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{status.location}</span>
              </div>
              <button type='button' className="flex cursor-pointer bg-green-200/30 p-2 rounded-xl items-center gap-1 text-green-600 dark:text-green-400">
                <MessageCircle className="w-4 h-4" />
                <span>iniciar conversacion</span>
              </button>
            </div>
            



          </div>
        </div>
            {/* Barra de progreso de nivel */}
            <div className="mb-4 mt-5">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{userStats.experience} XP</span>
                <span>{userStats.nextLevelExp} XP para Nivel {userStats.level + 1}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${(userStats.experience / userStats.nextLevelExp) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>       
        <div className='overflow-hidden w-full'>
            {/* Bio */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              ¡Hola! 👋 Soy un desarrollador web freelance especializado en crear experiencias digitales increíbles.
              Con más de {userStats.projectsCompleted} proyectos completados y {userStats.totalHoursWorked.toLocaleString()} horas de código.
            </p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden overflow-scroll">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Habilidades Técnicas
          </h3>
        </div>
        
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
          }}
        >
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{skill.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {skill.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${skill.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
        }}
      >
        <StatsCard
          icon={CheckCircle}
          value={userStats.tasksCompleted}
          label="Tareas Completadas"
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
        <StatsCard
          icon={DollarSign}
          value={`$${userStats.totalEarnings.toLocaleString()}`}
          label="Ganancias Totales"
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          icon={Clock}
          value={`${userStats.totalHoursWorked.toLocaleString()}h`}
          label="Horas Trabajadas"
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatsCard
          icon={Briefcase}
          value={userStats.projectsCompleted}
          label="Proyectos Finalizados"
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Sección de disponibilidad - preparada para el juego */}
      <div className="grid gap-4 mb-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}
      >
        {/* Disponibilidad */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Estado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {status.availability}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>{status.timezone}</span>
          </div>
        </div>

        {/* Comunidad - Preview del juego */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Comunidad
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Conecta con otros devs
              </p>
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
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                +24
              </span>
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
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reconocimientos
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userStats.badges.length} medallas desbloqueadas
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {userStats.badges.slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                className="text-2xl"
                title={badge.name}
              >
                {badge.emoji}
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