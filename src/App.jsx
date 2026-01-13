import { useState, useEffect, lazy, Suspense } from "react";
import { useSafeDevice } from "./hooks/useSafeDevice";
import { useAppSettingsStore } from "#store/appSettingsStore";
import { useAuthStore } from "#store/authStore";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./App.css";

import { AchievementNotificationContainer } from "#components/AchievementNotification";
import LockScreen from "#components/LockScreen";
import { SystemNotificationContainer } from "#components/SystemNotification";
import LoadingScreen from "#components/LoadingScreen";
import BootScreen from "#components/BootScreen";
import LoginBootSequence from "#components/LoginBootSequence";

const DesktopLayout = lazy(() => import("./layouts/DesktopLayout"));
const MobileLayout = lazy(() => import("./layouts/MobileLayout"));
const AdminDashboard = lazy(() => import("#components/AdminDashboard"));

gsap.registerPlugin(Draggable);

const WindowLoader = () => (
  <LoadingScreen variant="macos" message="Cargando sistema..." />
);

/**
 * FASES DE LA APP:
 * boot           -> BootScreen
 * login          -> LockScreen
 * loginSequence  -> LoginBootSequence (solo después de login)
 * loading        -> LoadingScreen (refresh con sesión)
 * app            -> App normal
 */
const App = () => {
  const device = useSafeDevice();
  const initialize = useAppSettingsStore(state => state.initialize);
  const { currentUser, isAuthenticated, restoreSession, logout } = useAuthStore();

  const [appPhase, setAppPhase] = useState("boot");
  const [isInitializing, setIsInitializing] = useState(true);

  // Decidir fase inicial
  useEffect(() => {
    const hasSession = localStorage.getItem("userSession");
    if (hasSession) {
      setAppPhase("loading"); // recarga con sesión
    } else {
      setAppPhase("boot"); // primera vez
    }
  }, []);

  // Inicializar stores y restaurar sesión
  useEffect(() => {
    if (appPhase === "boot") return;

    const init = async () => {
      await initialize();
      await restoreSession();
      setIsInitializing(false);

      const justLoggedIn = sessionStorage.getItem("justLoggedIn");
      if (justLoggedIn === "true") {
        setAppPhase("loginSequence");
      } else if (isAuthenticated) {
        setAppPhase("app");
      } else {
        setAppPhase("login");
      }
    };

    init();
  }, [appPhase, initialize, restoreSession, isAuthenticated]);

  // Manejo de logout seguro
  const handleLogout = () => {
    logout();                  // Borra currentUser
    setAppPhase("boot");        // Volver a BootScreen
    setIsInitializing(true);    // Bloquear app mientras inicia
  };

  // ========================
  // RENDER POR FASE
  // ========================
  if (device.type === "desktop" && appPhase === "boot") {
    return <BootScreen onBootComplete={() => setAppPhase("login")} />;
  }

  if (appPhase === "loginSequence") {
    return (
      <LoginBootSequence
        username={currentUser?.username || "Usuario"} // ⚡ Protegido con default
        onComplete={() => {
          sessionStorage.removeItem("justLoggedIn");
          setIsInitializing(false);
          setAppPhase("app");
        }}
      />
    );
  }

  if (appPhase === "loading" || isInitializing) {
    return <WindowLoader />;
  }

  if (appPhase === "login") {
    return (
      <Suspense fallback={<WindowLoader />}>
        <SystemNotificationContainer />
        <AchievementNotificationContainer />
        <LockScreen onLoginSuccess={() => setAppPhase("loginSequence")} />
      </Suspense>
    );
  }

  // ========================
  // APP NORMAL
  // ========================

  // ⚠️ Evitamos renderizar layouts sin currentUser
  if (!currentUser) {
    return <WindowLoader />;
  }

  if (currentUser.role === "admin") {
    return (
      <Suspense fallback={<WindowLoader />}>
        <SystemNotificationContainer />
        <AchievementNotificationContainer />
        <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<WindowLoader />}>
      <SystemNotificationContainer />
      <AchievementNotificationContainer />
      {device.type === "mobile" ? (
        <MobileLayout user={currentUser} onLogout={handleLogout} />
      ) : (
        <DesktopLayout user={currentUser} onLogout={handleLogout} />
      )}
    </Suspense>
  );
};

export default App;
