import { useState } from 'react';
import { 
  Search, Star, MapPin, Briefcase, Code, Award, 
  MessageCircle, Heart, UserPlus, Globe, CheckCircle,
  Filter, TrendingUp, Users, Clock
} from 'lucide-react';
import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
// Datos de ejemplo de freelancers
const freelancers = [
  {
    id: 1,
    name: "María González",
    username: "mariagdev",
    avatar: "/images/Avatar.png",
    role: "Full Stack Developer",
    level: 12,
    rank: "Experto",
    rankIcon: "🏆",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45,
    location: "Madrid, España",
    isOnline: true,
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    badges: ["⭐", "🔥", "💎"],
    completedProjects: 89,
    bio: "Desarrolladora full stack especializada en aplicaciones web modernas y escalables.",
    responseTime: "2h"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    username: "carlosdesign",
    avatar: null,
    role: "UI/UX Designer",
    level: 8,
    rank: "Avanzado",
    rankIcon: "🎨",
    rating: 4.7,
    reviews: 64,
    hourlyRate: 38,
    location: "Barcelona, España",
    isOnline: false,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    badges: ["🎨", "⭐"],
    completedProjects: 45,
    bio: "Diseñador apasionado por crear experiencias únicas y centradas en el usuario.",
    responseTime: "4h"
  },
  {
    id: 3,
    name: "Ana Silva",
    username: "anabackend",
    avatar: null,
    role: "Backend Developer",
    level: 15,
    rank: "Master",
    rankIcon: "👑",
    rating: 5.0,
    reviews: 203,
    hourlyRate: 55,
    location: "Buenos Aires, Argentina",
    isOnline: true,
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    badges: ["👑", "💎", "🔥", "⭐"],
    completedProjects: 156,
    bio: "Backend developer con 8+ años de experiencia en arquitecturas escalables.",
    responseTime: "1h"
  },
  {
    id: 4,
    name: "Luis Moreno",
    username: "luismobile",
    avatar: null,
    role: "Mobile Developer",
    level: 10,
    rank: "Profesional",
    rankIcon: "📱",
    rating: 4.8,
    reviews: 91,
    hourlyRate: 42,
    location: "Ciudad de México, México",
    isOnline: true,
    skills: ["React Native", "Flutter", "iOS", "Android"],
    badges: ["📱", "⭐", "🔥"],
    completedProjects: 67,
    bio: "Desarrollador mobile especializado en apps nativas y multiplataforma.",
    responseTime: "3h"
  }
];

const MAC_COLORS = [
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-indigo-400 to-indigo-600',
  'bg-gradient-to-br from-emerald-400 to-emerald-600',
];

const getAvatarColor = (name = '') => {
  if (!name) return MAC_COLORS[0];
  const code = name.charCodeAt(0);
  return MAC_COLORS[code % MAC_COLORS.length];
};

const Socials = ({ isMaximized, setIsMaximized }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [likedUsers, setLikedUsers] = useState(new Set());

        const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleLike = (userId) => {
    setLikedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const filteredFreelancers = freelancers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'online') return matchesSearch && user.isOnline;
    if (selectedFilter === 'top') return matchesSearch && user.rating >= 4.8;
    return matchesSearch;
  });

  return (
    <>
            <div id="window-header" className="bgt">
                <WindowControls target="socials" onMaximize={handleMaximize} />
                <h2 className="flex items-center gap-2 justify-center w-full">socials</h2>
            </div>
                  {/* Header fijo */}
   <div className="flex flex-col h-full min-h-0 bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Red de Freelancers</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Conecta con talento de todo el mundo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {filteredFreelancers.length} disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, rol o habilidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFilter('online')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedFilter === 'online'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="w-2 h-2 bg-current rounded-full" />
              Online
            </button>
            <button
              onClick={() => setSelectedFilter('top')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedFilter === 'top'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Star className="w-4 h-4" />
              Top Rated
            </button>
          </div>
        </div>
      </div>


      {/* Grid de freelancers - scrollable */}
       <div className="flex-1 min-h-0 overflow-y-auto">
      <div className=" p-4 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
          {filteredFreelancers.map((user) => {
            const initial = user.name.charAt(0).toUpperCase();
            const bgColor = getAvatarColor(user.name);
            const isLiked = likedUsers.has(user.id);

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-700"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center ring-4 ring-white dark:ring-gray-700`}>
                        <span className="text-2xl font-bold text-white">{initial}</span>
                      </div>
                    )}
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full" />
                    )}
                  </div>

                  {/* Info básica */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <button
                        onClick={() => toggleLike(user.id)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            isLiked
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">@{user.username}</p>
                    
                    {/* Stats inline */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({user.reviews})
                        </span>
                      </div>
                      <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {user.rankIcon} Nivel {user.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rol y ubicación */}
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{user.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {user.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 4 && (
                    <span className="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400">
                      +{user.skills.length - 4}
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Award className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-1">
                    {user.badges.map((badge, idx) => (
                      <span key={idx} className="text-lg">{badge}</span>
                    ))}
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tarifa por hora</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${user.hourlyRate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{user.responseTime}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron freelancers
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Intenta con otros filtros o términos de búsqueda
            </p>
          </div>
        )}
      </div>

       </div>
    </div>
        </>
  );
};
const SocialWindow = WindowWrapper(Socials, "socials");

export default SocialWindow;
