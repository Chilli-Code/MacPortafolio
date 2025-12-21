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
        "src/components/Desktop/windows"
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
       "#Desktop": resolve(
        dirname(fileURLToPath(import.meta.url)), 
        "src/components/Desktop"
      ),
"#Mobile": resolve(
  dirname(fileURLToPath(import.meta.url)), 
  "src/components/Mobile"
),
      "#windowsMobile": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/components/Mobile"
      ),
    },
  },
  
  // ⭐ AGREGAR ESTA SECCIÓN SERVER COMPLETA
  server: {
    host: '0.0.0.0', // Permite conexiones desde la red local
    port: 5173,
    open: true,
    
    // ⭐ PROXY PARA JSON-SERVER (IMPORTANTE PARA MÓVIL)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // Logs para debug
          proxy.on('error', (err, req, res) => {
            console.log('[Proxy Error]', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Proxy Request]', req.method, req.url);
          });
        }
      }
    },
    
    // Headers CORS (opcional pero útil)
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    
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
  
  // ⭐ Optimizaciones de build
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap'],
          'store-vendor': ['zustand'],
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
          'admin': [
            './src/components/AdminDashboard.jsx',
          ],
          'profile': [
            './src/windows/Profile.jsx',
            './src/windows/Settings.jsx',
          ],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    sourcemap: false,
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