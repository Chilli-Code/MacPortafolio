import useWindowStore from "#store/window";
import { Suspense, useEffect, useRef } from "react";
import useSounds from "#hooks/useSounds";

import { Navbar, Welcome, Dock } from "#components/Desktop";
import { Terminal, Safari, Profile, Settings, Resume, Finder, Socials, Galery, Text, Gmail, ImageWindowContent, Calendar } from "#components/Desktop/windows/";
import { usePerformanceMonitor } from '#hooks/usePerformanceMonitor'; // ✅ Importa del hook
import SystemResourcesSection from "#components/Systemresourcessection"; // ✅ Este es el componente visual

const DesktopLayout = ({ user, onLogout }) => {
  const windows = useWindowStore(state => state.windows);
  const { initSounds, playWindowOpen, playClick } = useSounds();
  const prevWindowsRef = useRef({});
  const { showMonitor } = usePerformanceMonitor();

  // Inicializar sonidos
  useEffect(() => {
    initSounds();
  }, [initSounds]);

  // Detectar cuando se abre una ventana
  useEffect(() => {
    const prevWindows = prevWindowsRef.current;

    Object.keys(windows).forEach(windowKey => {
      const wasOpen = prevWindows[windowKey]?.isOpen;
      const isOpen = windows[windowKey]?.isOpen;

      if (!wasOpen && isOpen) {
        // La ventana se acaba de abrir

        playWindowOpen();
      }
    });

    // Actualizar referencia anterior
    prevWindowsRef.current = { ...windows };
  }, [windows, playWindowOpen]);

  // Sonido de click global (excepto controles de ventana)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Excluir SOLO los controles de ventana (close, minimize, maximize)
      if (!e.target.closest('.close, .minimize, .maximize')) {

        playClick();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [playClick]);

  return (
    <main>
      <Navbar onLogout={onLogout} user={user} />
      <Welcome />
      <Dock />
      {showMonitor && (
        <div className="fixed  bottom-4 right-4 z-40 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <SystemResourcesSection />
        </div>
      )}
      <Suspense fallback={null}>
        {windows.terminal?.isOpen && <Terminal />}
        {windows.safari?.isOpen && <Safari />}
        {windows.finder?.isOpen && <Finder />}
        {windows.socials?.isOpen && <Socials />}
        {windows.galery?.isOpen && <Galery />}
        {windows.profile?.isOpen && <Profile />}
        {windows.imgfile?.isOpen && <ImageWindowContent />}
        {windows.settings?.isOpen && <Settings />}
        {windows.resume?.isOpen && <Resume />}
        {windows.txtfile?.isOpen && <Text />}
        {windows.gmail?.isOpen && <Gmail />}
        {windows.calendar?.isOpen && <Calendar />}
      </Suspense>
    </main>
  );
};

export default DesktopLayout;