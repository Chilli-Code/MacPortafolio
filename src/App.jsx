// src/App.jsx

import { useState, useEffect } from "react";
import { Navbar, Welcome, Dock, Home } from "#components";
import { AchievementNotificationContainer } from "#components/AchievementNotification"; // AGREGAR
import { 
  Terminal, Safari, Resume, Finder, Text, 
  ImageWindowContent, Contact, Galery, Profile, 
  Settings, Chat 
} from "#windows";
import LockScreen from "#components/LockScreen";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import "./app.css";
import { useAppSettingsStore } from "#store/notificationStore";

gsap.registerPlugin(Draggable);

const App = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
const initialize = useAppSettingsStore(state => state.initialize);

  useEffect(() => {
    initialize();
    const checkSession = () => {
      const session = localStorage.getItem('userSession');
      
      if (session) {
        try {
          const userData = JSON.parse(session);
          
          if (userData && userData.isLoggedIn === true) {
            setIsLocked(false);
          } else {
            localStorage.removeItem('userSession');
            setIsLocked(true);
          }
        } catch (error) {
          console.error('Error al leer la sesión:', error);
          localStorage.removeItem('userSession');
          setIsLocked(true);
        }
      } else {
        setIsLocked(true);
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLock = () => {
    localStorage.removeItem('userSession');
    setIsLocked(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <main>
      {/* Container de notificaciones - SIEMPRE VISIBLE */}
      <AchievementNotificationContainer />
      
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <>
          <Navbar onLogout={handleLock} />
          <Welcome />
          <Dock />
          <Terminal />
          <Safari />
          <Resume />
          <Finder />
          <Text />
          <ImageWindowContent />
          <Contact />
          <Home />
          <Galery />
          <Profile />
          <Settings />
          <Chat />
        </>
      )}
    </main>
  );
};

export default App;