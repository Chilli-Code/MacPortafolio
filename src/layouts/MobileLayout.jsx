import { MobileDock } from "#Mobile/MobileDock";
import { useState } from "react";
import { LogOut } from '#assets/icons';

// Importar screens
import HomeScreen from "#Mobile/Screens/HomeScreen";
import FinderScreen from "#Mobile/Screens/FinderScreen";
import SafariScreen from "#Mobile/Screens/SafariScreen";
import MessagesScreen from "#Mobile/Screens/MessagesScreen";
import ProfileScreen from "#Mobile/Screens/ProfileScreen";
import TerminalScreen from "#components/Mobile/Screens/TerminalScreen";
import SettingsScreen from "#components/Mobile/Screens/SettingsScreen";

const MobileLayout = ({ user, onLogout }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleAppClick = (appId) => {
    setCurrentScreen(appId);
  };

  const goBackToHome = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'finder':
        return <FinderScreen onBack={goBackToHome} />;
      case 'safari':
        return <SafariScreen onBack={goBackToHome} />;
      case 'terminal':
      return <TerminalScreen onBack={goBackToHome} />;
      case 'messages':
      return <MessagesScreen onBack={goBackToHome} />;
      case 'settings':
        return <SettingsScreen onBack={goBackToHome} />;
      case 'contact':
        return <ProfileScreen onBack={goBackToHome} />;
      default:
        return null; // No renderizar nada aquí, el home está abajo
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const isHome = currentScreen === 'home';

  // Si NO es home, mostrar app fullscreen
  if (!isHome) {
    return (
      <div className="h-screen w-full overflow-hidden">
        {renderScreen()}
      </div>
    );
  }

  // Si es home, mostrar layout normal
  return (
    <div className="h-screen w-full mobileBg bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-400 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-cyan-600 to-transparent opacity-50 rounded-t-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-800 to-transparent opacity-30 rounded-t-[150px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Hola, {user?.username} 👋</h2>
          <p className="text-white/80 mt-1 text-sm">Bienvenido a Mobile</p>
        </div>
        
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="bg-white/20 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-200 border border-white/30 shadow-lg"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Content - HomeScreen */}
      <div className="relative z-10 h-[calc(100vh-180px)] overflow-y-auto">
        <HomeScreen onAppClick={handleAppClick} />
      </div>

      {/* Dock */}
      <MobileDock onAppClick={handleAppClick} currentScreen={currentScreen} />

      {/* Modal Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Cerrar sesión?</h3>
              <p className="text-gray-600 text-sm">¿Estás seguro de que quieres cerrar tu sesión?</p>
            </div>
            
            <div className="border-t border-gray-200">
              <button onClick={confirmLogout} className="w-full py-4 text-red-600 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors">
                Cerrar sesión
              </button>
            </div>
            
            <div className="border-t border-gray-200">
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-4 text-blue-600 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MobileLayout;