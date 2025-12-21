// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ⭐ USAR /api EN LUGAR DE localhost:3001
// Vite redirigirá automáticamente a json-server
const API_BASE = '/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          console.log('🌐 Intentando login en:', `${API_BASE}/users`);
          
          const response = await fetch(
            `${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const users = await response.json();
          console.log('📦 Usuarios encontrados:', users.length);

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
          
          // Mensajes de error más específicos
          let errorMessage = 'Error de autenticación';
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'No se puede conectar al servidor. Verifica que json-server esté corriendo.';
          } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Error de red. Verifica tu conexión.';
          }
          
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        console.log('🔒 Cerrando sesión...');
        set({ currentUser: null, isAuthenticated: false });
        
        const keysToRemove = ['userSession', 'auth-storage'];
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          console.log(`  ✓ Removido: ${key}`);
        });
        
        console.log('✅ Sesión cerrada completamente');
      },

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

      getCurrentUser: () => get().currentUser
    }),
    {
      name: 'auth-storage'
    }
  )
);