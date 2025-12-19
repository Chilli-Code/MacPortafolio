import React, { useRef, useEffect } from "react";
import { X, LogOut, Power, RotateCw, Moon } from "lucide-react";
import gsap from "gsap";

const LogoutModal = ({ onClose, onLogout }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    // Animación de entrada
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 }
    );
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" }
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('userSession');
    handleClose();
    // Validar que onLogout sea una función antes de llamarla
    setTimeout(() => {
      if (typeof onLogout === 'function') {
        onLogout();
      }
    }, 300);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed w-60 h-57 py-2 inset-0 z-[99999] right-265 top-12 flex items-center justify-center bg-white/85 dark:bg-gray-900/85 backdrop-blur-[40px] rounded-2xl shadow-2xl"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full relative gap-1 flex flex-col  overflow-hidden"
      >

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-col gap-2">
            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <div className="flex-col gap-0 flex-1 text-left">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Cerrar sesión
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bloquear la pantalla
                </p>
              </div>
            </button>


            {/* Reposo */}
            <button className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left flex-col gap-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Reposo
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Modo de bajo consumo
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-1 w-full border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="w-full py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 cursor-pointer dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;