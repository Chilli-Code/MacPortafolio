// /components/Profile/components/EditProfileModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, Mail, MapPin, Briefcase, Globe, MessageSquare } from '#assets/icons';
import gsap from 'gsap';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  const [formData, setFormData] = useState({
    name: userData.name || '',
    role: userData.role || '',
    bio: userData.bio || '',
    location: userData.location || '',
    redes: userData.redes || '',
  });

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isOpen) {
      // Animación de entrada tipo macOS
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: onClose,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header estilo macOS */}
        <div className="relative">
          {/* Controles de ventana macOS */}
          <div className="absolute left-4 top-4 flex items-center gap-2 z-10">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative"
              aria-label="Cerrar"
            >
              <X className="w-2 h-2 text-red-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>

          {/* Título centrado */}
          <div className="pt-4 pb-5 px-6 text-center border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Editar Perfil
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Actualiza tu información personal
            </p>
          </div>
        </div>

        {/* Form con scroll */}
        <form onSubmit={handleSubmit} className="max-h-[calc(85vh-140px)] overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MacInputField
                icon={User}
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
              />
              <MacInputField
                icon={Briefcase}
                label="Rol"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Desarrollador Full Stack"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Ubicación y Redes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MacInputField
                icon={MapPin}
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ciudad, País"
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  Redes Sociales
                </label>
                <div className="relative">
                  <select
                    name="redes"
                    value={formData.redes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="siR">Mostrar</option>
                    <option value="noR">Ocultar</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                    Tip: Completa tu perfil
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                    Un perfil completo te ayuda a destacar y conectar mejor con otros profesionales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente InputField estilo macOS
const MacInputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5 text-blue-500" />}
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
    />
  </div>
);

export default EditProfileModal;