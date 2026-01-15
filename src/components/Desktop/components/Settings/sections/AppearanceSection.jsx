// src/components/Settings/sections/AppearanceSection.jsx

import { useState, useEffect } from 'react';
import { Palette, Monitor, Moon, Sun, Check } from '#assets/icons';
import clsx from 'clsx';
import gsap from 'gsap';
import { useAuthStore } from '#store/authStore';
import FontSizeSection from '../FontSizeSection';


import PerformanceMonitorToggle from '#components/Desktop/Components/Settings/PerformanceMonitorToggle';
import PerformanceMonitor from '#components/Systemresourcessection';

const AppearanceSection = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState("/images/wallpapers/wallpaper.webp");
  const [theme, setTheme] = useState("light");
  const currentUser = useAuthStore(state => state.currentUser);

  // Cargar configuración desde localStorage
  useEffect(() => {
    const defaultWallpaper = "/images/wallpapers/wallpaper.webp";
    const savedWallpaper = localStorage.getItem("wallpaper");
    const savedTheme = localStorage.getItem("theme") || "light";
    
    const wallpaperToUse = savedWallpaper || defaultWallpaper;
    
    if (!savedWallpaper) {
      localStorage.setItem("wallpaper", defaultWallpaper);
    }
    
    setSelectedWallpaper(wallpaperToUse);
    setTheme(savedTheme);
    
    // Aplicar wallpaper
    document.documentElement.style.setProperty('--wallpaper-url', `url(${wallpaperToUse})`);
    
    // Si estamos en dark mode, aplicar también al body
    if (savedTheme === "dark") {
      document.body.style.backgroundImage = `url(${wallpaperToUse})`;
      document.documentElement.style.backgroundImage = `url(${wallpaperToUse})`;
    }
  }, []);

  const handleWallpaperChange = (wallpaperPath) => {
    setSelectedWallpaper(wallpaperPath);
    localStorage.setItem("wallpaper", wallpaperPath);
    
    // Cambiar wallpaper dinámicamente
    document.documentElement.style.setProperty('--wallpaper-url', `url(${wallpaperPath})`);
    
    // Si estamos en dark mode, forzar actualización
    if (theme === "dark") {
      document.body.style.backgroundImage = `url(${wallpaperPath})`;
      document.documentElement.style.backgroundImage = `url(${wallpaperPath})`;
    }
  };

  // Función para cambiar tema con animación de Apple
  const handleThemeChange = (newTheme) => {
    const switchTheme = () => {
      setTheme(newTheme);
      
      // ⭐ GUARDAR EN localStorage PRIMERO
      localStorage.setItem("theme", newTheme);
      
      // ⭐ ACTUALIZAR userSession SI EXISTE
      const savedUser = localStorage.getItem('userSession');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          userData.preferences = userData.preferences || {};
          userData.preferences.theme = newTheme;
          localStorage.setItem('userSession', JSON.stringify(userData));
          
          console.log('💾 Tema guardado en userSession:', newTheme);
          
          // ⭐ ACTUALIZAR EN EL BACKEND (opcional, sin bloquear)
          if (userData.id) {
            fetch(`/api/users/${userData.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                preferences: userData.preferences
              })
            }).catch(err => console.error('Error actualizando tema en backend:', err));
          }
        } catch (error) {
          console.error('Error actualizando userSession:', error);
        }
      }

      // ⭐ APLICAR TEMA AL DOM
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        gsap.fromTo(
          [document.documentElement, document.body],
          { opacity: 0.8, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
        );
      } else {
        document.documentElement.classList.remove("dark");
        gsap.fromTo(
          [document.documentElement, document.body],
          { opacity: 0.8, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
        );
      }
      
      console.log('🎨 Tema cambiado a:', newTheme);
    };

    // View Transition API con logo de Apple
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        switchTheme();
      });

      transition.ready.then(() => {
        const maskId = 'apple-mask-transition';
        const existingMask = document.getElementById(maskId);
        if (existingMask) {
          existingMask.remove();
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = maskId;
        svg.style.position = 'fixed';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '9999';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
        mask.id = 'apple-logo-mask';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', 'white');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M21.5085 7.74883C21.6199 7.74883 21.7924 7.76209 22.0258 7.78862C22.2646 7.80985 22.5352 7.86821 22.8376 7.96372C23.1401 8.05923 23.4478 8.2131 23.7609 8.42534C24.0739 8.63758 24.3631 8.93472 24.6284 9.31675C24.6019 9.33267 24.5011 9.4043 24.326 9.53164C24.1562 9.65898 23.9625 9.84469 23.745 10.0888C23.5274 10.3275 23.3364 10.6326 23.1719 11.0041C23.0127 11.3702 22.9332 11.8079 22.9332 12.3173C22.9332 12.9009 23.034 13.3944 23.2356 13.7977C23.4425 14.2009 23.6813 14.5272 23.9519 14.7766C24.2278 15.026 24.4719 15.209 24.6841 15.3258C24.9017 15.4372 25.0184 15.4956 25.0343 15.5009C25.029 15.5221 24.9892 15.6415 24.9149 15.859C24.8407 16.0713 24.7239 16.3472 24.5647 16.6868C24.4109 17.021 24.2092 17.3712 23.9599 17.7374C23.7317 18.061 23.4956 18.3714 23.2515 18.6686C23.0127 18.9657 22.7501 19.2071 22.4636 19.3928C22.1824 19.5838 21.864 19.6793 21.5085 19.6793C21.2379 19.6793 21.0071 19.6475 20.8161 19.5838C20.625 19.5202 20.442 19.4459 20.2669 19.361C20.0971 19.2814 19.9087 19.2098 19.7018 19.1461C19.4949 19.0824 19.2375 19.0506 18.9298 19.0506C18.5265 19.0506 18.1896 19.101 17.919 19.2018C17.6537 19.3079 17.4017 19.414 17.1629 19.5202C16.9241 19.6263 16.6429 19.6793 16.3192 19.6793C15.8258 19.6793 15.3907 19.4857 15.014 19.0983C14.6425 18.711 14.2605 18.2441 13.8679 17.6976C13.5654 17.2625 13.2895 16.7611 13.0401 16.1933C12.7908 15.6256 12.5918 15.0233 12.4432 14.3866C12.2946 13.7499 12.2204 13.1132 12.2204 12.4765C12.2204 11.4577 12.414 10.5981 12.8014 9.89775C13.1887 9.19206 13.6848 8.65881 14.2897 8.298C14.8946 7.93189 15.5233 7.74883 16.176 7.74883C16.5209 7.74883 16.8445 7.80985 17.147 7.93189C17.4547 8.05392 17.7412 8.17596 18.0065 8.298C18.2718 8.41473 18.5133 8.4731 18.7308 8.4731C18.9377 8.4731 19.1818 8.41473 19.463 8.298C19.7443 8.17596 20.0547 8.05392 20.3942 7.93189C20.7391 7.80985 21.1105 7.74883 21.5085 7.74883ZM20.9514 6.45947C20.6861 6.78314 20.3518 7.05109 19.9485 7.26333C19.5506 7.47557 19.1739 7.58169 18.8184 7.58169C18.7441 7.58169 18.6724 7.57373 18.6035 7.55781C18.5982 7.53659 18.5902 7.49945 18.5796 7.44639C18.5743 7.39333 18.5716 7.33496 18.5716 7.27129C18.5716 6.86803 18.6592 6.47539 18.8343 6.09336C19.0094 5.71133 19.211 5.39297 19.4392 5.13828C19.7204 4.804 20.0759 4.52544 20.5057 4.30259C20.9408 4.07974 21.3573 3.96035 21.7552 3.94443C21.7711 4.03464 21.7791 4.1381 21.7791 4.25483C21.7791 4.6634 21.7022 5.06135 21.5483 5.44868C21.3944 5.83071 21.1954 6.16764 20.9514 6.45947Z');
        path.setAttribute('fill', 'black');

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        path.setAttribute('transform', 'translate(-18.5, -11.8)');

        group.appendChild(path);
        mask.appendChild(rect);
        mask.appendChild(group);
        defs.appendChild(mask);
        svg.appendChild(defs);

        const maskedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        maskedRect.setAttribute('width', '100%');
        maskedRect.setAttribute('height', '100%');
        maskedRect.setAttribute('fill', newTheme === 'dark' ? '#000000' : '#ffffff');
        maskedRect.setAttribute('mask', 'url(#apple-logo-mask)');
        svg.appendChild(maskedRect);

        document.body.appendChild(svg);

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const maxDimension = Math.max(window.innerWidth, window.innerHeight);
        const finalScale = maxDimension * 3;

        const animation = group.animate(
          [
            { transform: `translate(${centerX}px, ${centerY}px) scale(1)` },
            { transform: `translate(${centerX}px, ${centerY}px) scale(${finalScale})` }
          ],
          {
            duration: 5000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          }
        );

        animation.onfinish = () => {
          svg.remove();
        };
      });
    } else {
      switchTheme();
    }
  };

  const wallpapers = [
    { id: 1, path: "/images/wallpapers/wallpaper.webp", name: "macOS Sequoia" },
    { id: 2, path: "/images/wallpapers/wallpaper2.webp", name: "Big Sur" },
    { id: 3, path: "/images/wallpapers/wallpaper3.webp", name: "Monterey" },
    { id: 4, path: "/images/wallpapers/wallpaper4.webp", name: "Ventura" },
    { id: 5, path: "/images/wallpapers/wallpaper5.webp", name: "Ventura" },
    { id: 6, path: "/images/wallpapers/wallpaper6.webp", name: "Ventura" },
    { id: 7, path: "/images/wallpapers/wallpaper7.webp", name: "Ventura" },
    { id: 8, path: "/images/wallpapers/wallpaper8.webp", name: "Ventura" },
    { id: 9, path: "/images/wallpapers/wallpaper9.webp", name: "Ventura" },
    { id: 10, path: "/images/wallpapers/wallpaper10.webp", name: "Ventura" },
    { id: 11, path: "/images/wallpapers/wallpaper11.webp", name: "Ventura" },
    // { id: 12, path: "/images/wallpapers/wallpaper12.webp", name: "Ventura" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-black dark:text-white text-2xl font-semibold mb-2 flex items-center gap-2">
          <Palette className="w-6 h-6 text-blue-500" />
          Apariencia
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Personaliza la apariencia de tu escritorio
        </p>
      </div>

      {/* Selector de Tema */}
      <div>
        <h3 className="text-black dark:text-white text-lg font-medium mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Tema del sistema
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {/* Tema Claro */}
          <div 
            className={clsx(
              "relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden",
              theme === "light" 
                ? "border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg" 
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            )}
            onClick={() => handleThemeChange("light")}
          >
            {/* Preview del tema claro */}
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-white rounded-lg shadow-sm p-3 space-y-2">
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Label */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Claro</span>
                </div>
                {theme === "light" && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Tema Oscuro */}
          <div 
            className={clsx(
              "relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden",
              theme === "dark" 
                ? "border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg" 
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            )}
            onClick={() => handleThemeChange("dark")}
          >
            {/* Preview del tema oscuro */}
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg shadow-sm p-3 space-y-2">
                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                <div className="h-2 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>

            {/* Label */}
            <div className="p-3 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Oscuro</span>
                </div>
                {theme === "dark" && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </div>
              <div className="mt-6">
         <PerformanceMonitorToggle />
        </div>

          

      {/* Selector de Fondo de Pantalla */}
      <div>
        <h3 className="text-black dark:text-white text-lg font-medium mb-4">
          Fondo de Pantalla
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className={clsx(
                "relative group rounded-xl overflow-hidden cursor-pointer transition-all",
                "border-2 will-change-transform transition-transform duration-200 ease-out",
                selectedWallpaper === wallpaper.path
                  ? "border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:scale-[1.02]"
              )}
              onClick={() => handleWallpaperChange(wallpaper.path)}
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                <img
                  draggable={false}
                  src={wallpaper.path}
                  alt={wallpaper.name}
                  loading='lazy'
                   decoding="async"
                 className="w-full h-full object-cover will-change-transform"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x225/3b82f6/ffffff?text=${wallpaper.name}`;
                  }}
                />
              </div>
              
              {/* Check indicator */}
              {selectedWallpaper === wallpaper.path && (
                <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1.5 shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Overlay con nombre */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-semibold">{wallpaper.name}</p>
                </div>
              </div>

              {/* Border glow effect cuando está seleccionado */}
              {selectedWallpaper === wallpaper.path && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <p className="mt-4 mb-20 text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Los fondos de pantalla se adaptan automáticamente al tema seleccionado
        </p>
      </div>
    </div>
  );
};

export default AppearanceSection;