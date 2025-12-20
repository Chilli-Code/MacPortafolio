import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "#components": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/components",
      ),
      "#constants": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/constants",
      ),
      "#assets": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/assets/",
      ),
      "#store": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/store"
      ),
      "#hoc": resolve(
        dirname(fileURLToPath(import.meta.url)), 
        "src/hoc"
      ),
      "#windows": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/windows"
      ),
      "#services": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/services"
      ),
      "#utils": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/utils"
      ),
      "#icons": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/icons"
      ),
    },
  },
  
  // ⭐ Optimizaciones de build
  build: {
    // Aumentar el límite de advertencia de chunk
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // ⭐ Code splitting manual para mejor performance
        manualChunks: {
          // Vendors grandes en chunks separados
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap'],
          'store-vendor': ['zustand'],
          
          // Windows agrupadas
          'windows-core': [
            './src/windows/Terminal.jsx',
            './src/windows/Safari.jsx',
          ],
          'windows-media': [
            './src/windows/Galery.jsx',
            './src/windows/Image.jsx',
          ],
          'windows-docs': [
            './src/windows/Text.jsx',
            './src/windows/Resume.jsx',
            './src/windows/Finder.jsx',
          ],
          'windows-social': [
            './src/windows/Chat.jsx',
            './src/windows/Contact.jsx',
          ],
          
          // Componentes admin
          'admin': [
            './src/components/AdminDashboard.jsx',
          ],
          
          // Profile & Settings
          'profile': [
            './src/windows/Profile.jsx',
            './src/windows/Settings.jsx',
          ],
        },
        
        // ⭐ Nombres de archivos más limpios
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // ⭐ Minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      }
    },
    
    // ⭐ Source maps solo en desarrollo
    sourcemap: false,
  },
  
  // ⭐ Optimizaciones del servidor de desarrollo
  server: {
    port: 5173,
    open: true,
    // Pre-calentamiento de módulos comunes
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/components/Navbar.jsx',
        './src/components/Dock.jsx',
        './src/windows/Terminal.jsx',
        './src/windows/Safari.jsx',
      ]
    }
  },
  
  // ⭐ Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'gsap',
      'zustand',
    ],

  },
});