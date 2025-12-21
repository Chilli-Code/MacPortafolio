// src/App.jsx


import { useState, useEffect, lazy, Suspense, memo } from "react";
import { useSafeDevice } from "./hooks/useSafeDevice";
import { useAppSettingsStore } from "#store/notificationStore";
import { useAuthStore } from "#store/authStore";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./App.css";

// Componentes críticos
import { AchievementNotificationContainer } from "#components/AchievementNotification";
import LockScreen from "#components/LockScreen";

// Layouts lazy
const DesktopLayout = lazy(() => import("./layouts/DesktopLayout"));
const MobileLayout = lazy(() => import("./layouts/MobileLayout"));
const AdminDashboard = lazy(() => import("#components/AdminDashboard"));
const DeviceBlocker = lazy(() => import("#components/DeviceBlocker"));

gsap.registerPlugin(Draggable);

const WindowLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="text-white text-xl">Cargando sistema...</div>
    </div>
  </div>
);

const AppContent = memo(({ device, isAuthenticated, currentUser, handleLock }) => {
  const { type, isDesktopResized, isReady } = device;
  
  if (!isReady) return <WindowLoader />;
  
  // Bloquear desktop redimensionado
  if (isDesktopResized) {
    return <DeviceBlocker />;
  }
  
  // Lógica normal de tu app
  if (!isAuthenticated) {
    return <LockScreen onUnlock={() => {}} />;
  }
  
  if (currentUser?.role === 'admin') {
    return <AdminDashboard onLogout={handleLock} currentUser={currentUser} />;
  }
  
  return type === 'mobile' ? 
    <MobileLayout user={currentUser} onLogout={handleLock} /> : 
    <DesktopLayout user={currentUser} onLogout={handleLock} />;
});

AppContent.displayName = 'AppContent';


const App = () => {
  const device = useSafeDevice();
  const [isLoading, setIsLoading] = useState(true);
  const initialize = useAppSettingsStore(state => state.initialize);
  const { currentUser, isAuthenticated, restoreSession, logout } = useAuthStore();
  
  // ⭐ Detectar mobile

  useEffect(() => {
    const init = async () => {
      await initialize();
      await restoreSession();
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

  if (isLoading) {
    return <WindowLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<WindowLoader />}>
        <AchievementNotificationContainer />
        <LockScreen onUnlock={handleUnlock} />
      </Suspense>
    );
  }

  if (currentUser?.role === 'admin') {
    return (
      <Suspense fallback={<WindowLoader />}>
        <AchievementNotificationContainer />
        <AdminDashboard onLogout={handleLock} currentUser={currentUser} />
      </Suspense>
    );
  }

  // ⭐ Renderizar layout según dispositivo
  return (
    <Suspense fallback={<WindowLoader />}>
      <AchievementNotificationContainer />
      <AppContent 
        device={device}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        handleLock={handleLock}
      />
    </Suspense>
  );
};

export default App;