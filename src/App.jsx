// src/App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./app.css";
import { useAppSettingsStore } from "#store/notificationStore";
import { useAuthStore } from "#store/authStore";

// ⭐ Componentes críticos - Cargar inmediatamente
import { Navbar, Welcome, Dock } from "#components";
import { AchievementNotificationContainer } from "#components/AchievementNotification";
import LockScreen from "#components/LockScreen";

// ⭐ Componentes grandes - Lazy load
const AdminDashboard = lazy(() => import("#components/AdminDashboard"));

// ⭐ Ventanas - Lazy load
const Terminal = lazy(() => import("#windows/Terminal"));
const Safari = lazy(() => import("#windows/Safari"));
const Resume = lazy(() => import("#windows/Resume"));
const Finder = lazy(() => import("#windows/Finder"));
const Text = lazy(() => import("#windows/Text"));
const ImageWindowContent = lazy(() => import("#windows/Image"));
const Contact = lazy(() => import("#windows/Contact"));
const Home = lazy(() => import("#components/Home"));
const Galery = lazy(() => import("#windows/Galery"));
const Profile = lazy(() => import("#windows/Profile"));
const Settings = lazy(() => import("#windows/Settings"));
const Chat = lazy(() => import("#windows/Chat"));

gsap.registerPlugin(Draggable);

// ⭐ Loading component
const WindowLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const initialize = useAppSettingsStore(state => state.initialize);
  const { currentUser, isAuthenticated, restoreSession, logout } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initialize();
      await restoreSession();
      // Pequeño delay para asegurar que todo está listo
      setTimeout(() => setIsLoading(false), 100);
    };
    init();
  }, [initialize, restoreSession]);

  const handleUnlock = (userData) => {
    console.log('✅ Usuario autenticado:', userData);
  };

  const handleLock = () => {
    logout();
    console.log('🔒 Sesión cerrada');
  };

  // Loading inicial
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-white text-xl">Cargando sistema...</div>
        </div>
      </div>
    );
  }

  // LockScreen
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<WindowLoader />}>
        <AchievementNotificationContainer />
        <LockScreen onUnlock={handleUnlock} />
      </Suspense>
    );
  }

  // Admin Dashboard
  if (currentUser?.role === 'admin') {
    return (
      <Suspense fallback={<WindowLoader />}>
        <AchievementNotificationContainer />
        <AdminDashboard onLogout={handleLock} currentUser={currentUser} />
      </Suspense>
    );
  }

  // Desktop del usuario
  return (
    <main>
      <AchievementNotificationContainer />
      
      {/* ⭐ Componentes críticos - Sin lazy */}
      <Navbar onLogout={handleLock} />
      <Welcome />
      <Dock />
      
      {/* ⭐ Ventanas - Con lazy loading */}
      <Suspense fallback={null}>
        <Terminal />
      </Suspense>
      
      <Suspense fallback={null}>
        <Safari />
      </Suspense>
      
      <Suspense fallback={null}>
        <Resume />
      </Suspense>
      
      <Suspense fallback={null}>
        <Finder />
      </Suspense>
      
      <Suspense fallback={null}>
        <Text />
      </Suspense>
      
      <Suspense fallback={null}>
        <ImageWindowContent />
      </Suspense>
      
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={null}>
        <Home />
      </Suspense>
      
      <Suspense fallback={null}>
        <Galery />
      </Suspense>
      
      <Suspense fallback={null}>
        <Profile />
      </Suspense>
      
      <Suspense fallback={null}>
        <Settings />
      </Suspense>
      
      <Suspense fallback={null}>
        <Chat />
      </Suspense>
    </main>
  );
};

export default App;