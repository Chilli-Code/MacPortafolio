// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:3001';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      // Login
      login: async (username, password) => {
        try {
          const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
          const users = await response.json();

          if (users.length > 0) {
            const user = users[0];
            const userSession = {
              ...user,
              isLoggedIn: true,
              loginTime: new Date().toISOString()
            };

            set({ currentUser: userSession, isAuthenticated: true });
            localStorage.setItem('userSession', JSON.stringify(userSession));
            
            console.log('✅ Login exitoso:', user.username);
            return { success: true, user: userSession };
          }

          return { success: false, error: 'Usuario o contraseña incorrectos' };
        } catch (error) {
          console.error('❌ Error en login:', error);
          return { success: false, error: 'Error de conexión' };
        }
      },

      // ⭐ Logout mejorado - Limpia TODO
      logout: () => {
        console.log('🔒 Cerrando sesión...');
        
        // 1. Limpiar estado de Zustand
        set({ currentUser: null, isAuthenticated: false });
        
        // 2. Limpiar TODOS los stores de localStorage
        const keysToRemove = [
          'userSession',           // Sesión del usuario
          'auth-storage',          // Store de autenticación
          'tasks-storage',         // Store de tareas
          'windows-storage',       // Store de ventanas
        ];
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          console.log(`  ✓ Removido: ${key}`);
        });
        
        // 3. Opción nuclear: Limpiar TODO el localStorage (descomentar si quieres)
        // localStorage.clear();
        // console.log('  💥 localStorage completamente limpio');
        
        console.log('✅ Sesión cerrada completamente');
      },

      // Restaurar sesión
      restoreSession: () => {
        const session = localStorage.getItem('userSession');
        if (session) {
          try {
            const userData = JSON.parse(session);
            if (userData.isLoggedIn) {
              set({ currentUser: userData, isAuthenticated: true });
              console.log('✅ Sesión restaurada:', userData.username);
              return userData;
            }
          } catch (error) {
            console.error('❌ Error al restaurar sesión:', error);
          }
        }
        return null;
      },

      // Obtener usuario actual
      getCurrentUser: () => get().currentUser
    }),
    {
      name: 'auth-storage'
    }
  )
);

// ⭐ Hook para usar en componentes
export const useAuth = () => {
  const { currentUser, isAuthenticated, login, logout, restoreSession } = useAuthStore();
  
  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    restoreSession,
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user'
  };
};