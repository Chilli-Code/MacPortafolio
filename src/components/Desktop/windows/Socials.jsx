// src/components/Windows/Socials.jsx - VERSIÓN CORREGIDA
import { useState } from 'react';
import {
  Search, Heart, MessageCircle, Repeat2, Share, MoreHorizontal,
  Image, Smile, MapPin, Send, TrendingUp, Users, Bell, Home,
  User, Bookmark, CheckCircle, Sparkles, PanelLeftClose, PanelLeftOpen
} from '#assets/icons';
import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import clsx from 'clsx';

// Usuario actual
const currentUser = {
  name: "María González",
  username: "mariagdev",
  avatar: "/images/Avatar.png",
  isVerified: true
};

// Posts de ejemplo
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Ana Silva",
      username: "anabackend",
      avatar: null,
      isVerified: true
    },
    content: "Acabo de lanzar mi nuevo proyecto en producción 🚀 Una API REST con Node.js y PostgreSQL que maneja +10k requests/segundo. El secreto: índices bien optimizados y caching inteligente con Redis.",
    timestamp: "Hace 2h",
    likes: 234,
    retweets: 45,
    replies: 28,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false
  },
  {
    id: 2,
    author: {
      name: "Carlos Ruiz",
      username: "carlosdesign",
      avatar: null,
      isVerified: false
    },
    content: "Hot take: El mejor diseño es el que no se nota. Si tu usuario tiene que pensar en cómo usar tu interfaz, ya fallaste. La simplicidad siempre gana. 🎨",
    timestamp: "Hace 5h",
    likes: 892,
    retweets: 156,
    replies: 67,
    isLiked: true,
    isRetweeted: false,
    isBookmarked: true
  },
  {
    id: 3,
    author: {
      name: "Luis Moreno",
      username: "luismobile",
      avatar: null,
      isVerified: true
    },
    content: "¿Alguien más emocionado por el nuevo React 19? Las Server Actions van a cambiar completamente cómo construimos apps. Ya estoy migrando mis proyectos 💪",
    timestamp: "Hace 1d",
    likes: 445,
    retweets: 89,
    replies: 92,
    isLiked: false,
    isRetweeted: true,
    isBookmarked: false
  }
];

const sidebarItems = [
  {
    name: "Principal",
    items: [
      { id: "home", name: "Inicio", icon: Home },
      { id: "trending", name: "Tendencias", icon: TrendingUp },
      { id: "notifications", name: "Notificaciones", icon: Bell },
    ],
  },
  {
    name: "Cuenta",
    items: [
      { id: "bookmarks", name: "Guardados", icon: Bookmark },
      { id: "profile", name: "Perfil", icon: User },
    ],
  },
];

const MAC_COLORS = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-emerald-500 to-emerald-600',
];

const getAvatarColor = (name = '') => {
  if (!name) return MAC_COLORS[0];
  const code = name.charCodeAt(0);
  return MAC_COLORS[code % MAC_COLORS.length];
};



const Socials = ({ isMaximized, setIsMaximized }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [showSidebars, setShowSidebars] = useState(true); // 👈 NUEVO

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
        : post
    ));
  };

  const toggleRetweet = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
          ...post,
          isRetweeted: !post.isRetweeted,
          retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1
        }
        : post
    ));
  };

  const toggleBookmark = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: currentUser,
        content: newPost,
        timestamp: "Ahora",
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isRetweeted: false,
        isBookmarked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };
  const renderList = (name, items, className = "") => (
    <div className={className}>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              item.id === activeTab
                ? "active"
                : "not-active notActive"
            )}
          >
            {/* ICONO */}
            <item.icon className="w-4 h-4 flex-shrink-0" />

            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );



  return (
    <>
      {/* 👇 HEADER ARRASTRABLE CON ID CORRECTO */}
      <div id="window-header" className="bgt">
        <WindowControls target="socials" onMaximize={handleMaximize} />
        <h2 className="flex items-center gap-2 justify-center w-full">DevNetwork</h2>
      </div>

      <div className="flex h-full min-h-0 bg-white dark:bg-gray-900">
        {/* Sidebar izquierda - Con transición */}
        <div className="w-48 sidebar !bg-white dark:!bg-gray-800 sidebarFolder flex-shrink-0 overflow-y-auto">
          {/* Logo */}
         
            <h3 className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
              </div>
              DevNetwork
            </h3>


          {sidebarItems.map((section) =>
            renderList(section.name, section.items)
          )}

          <div className="px-4 mt-4">
            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl">
              Publicar
            </button>
          </div>
  
        </div>



        {/* Feed principal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header del feed con botón toggle */}
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 👇 BOTÓN PARA OCULTAR/MOSTRAR LATERALES */}
                <button
                  onClick={() => setShowSidebars(!showSidebars)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={showSidebars ? 'Ocultar paneles laterales' : 'Mostrar paneles laterales'}
                >
                  {showSidebars ? (
                    <PanelLeftClose className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <PanelLeftOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'home' && 'Inicio'}
                  {activeTab === 'trending' && 'Tendencias'}
                  {activeTab === 'notifications' && 'Notificaciones'}
                </h2>
              </div>
            </div>
          </div>

          {/* Crear nuevo post */}
          {activeTab === 'home' && (
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-xl ${getAvatarColor(currentUser.name)} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="¿Qué estás construyendo?"
                    className="w-full bg-transparent border-0 text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none"
                    rows="3"
                  />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-500">
                        <Image className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-500">
                        <Smile className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-500">
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed de posts */}
          <div className="flex-1 overflow-y-auto">
            {posts.map((post) => {
              const initial = post.author.name.charAt(0).toUpperCase();
              const bgColor = getAvatarColor(post.author.name);

              return (
                <div
                  key={post.id}
                  className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex gap-3">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xl font-bold text-white">{initial}</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
                            {post.author.name}
                          </span>
                          {post.author.isVerified && (
                            <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
                          )}
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            @{post.author.username}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {post.timestamp}
                          </span>
                        </div>

                        <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed mb-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between max-w-md">
                        <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                            <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500" />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                            {post.replies}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleRetweet(post.id)}
                          className={`flex items-center gap-2 group transition-colors ${post.isRetweeted ? 'text-green-500' : 'hover:text-green-500'
                            }`}
                        >
                          <div className={`p-2 rounded-full transition-colors ${post.isRetweeted
                              ? 'bg-green-50 dark:bg-green-900/30'
                              : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/30'
                            }`}>
                            <Repeat2 className={`w-5 h-5 ${post.isRetweeted
                                ? 'text-green-500'
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'
                              }`} />
                          </div>
                          <span className={`text-sm ${post.isRetweeted
                              ? 'text-green-500'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'
                            }`}>
                            {post.retweets}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 group transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'
                            }`}
                        >
                          <div className={`p-2 rounded-full transition-colors ${post.isLiked
                              ? 'bg-red-50 dark:bg-red-900/30'
                              : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                            }`}>
                            <Heart className={`w-5 h-5 ${post.isLiked
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
                              }`} />
                          </div>
                          <span className={`text-sm ${post.isLiked
                              ? 'text-red-500'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
                            }`}>
                            {post.likes}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className="group hover:text-blue-500 transition-colors"
                        >
                          <div className={`p-2 rounded-full transition-colors ${post.isBookmarked
                              ? 'bg-blue-50 dark:bg-blue-900/30'
                              : 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                            }`}>
                            <Bookmark className={`w-5 h-5 ${post.isBookmarked
                                ? 'text-blue-500 fill-blue-500'
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500'
                              }`} />
                          </div>
                        </button>

                        <button className="group hover:text-blue-500 transition-colors">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                            <Share className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar derecha - Con transición */}
        <div className={`flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto transition-all duration-300 ${showSidebars ? 'w-80' : 'w-0 overflow-hidden'
          }`}>
          <div className="p-4 w-80">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-200 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Tendencias para ti
              </h3>
              <div className="space-y-4">
                {['React 19', 'TypeScript', 'Next.js', 'Tailwind'].map((trend, idx) => (
                  <div key={idx} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tecnología · Trending</p>
                    <p className="font-semibold text-gray-900 dark:text-white">#{trend}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(Math.random() * 50)}K posts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SocialWindow = WindowWrapper(Socials, "socials");

export default SocialWindow;