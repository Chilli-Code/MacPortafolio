// /components/Profile/components/EditProfileModal.jsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, Mail, MapPin, Briefcase, Globe, MessageSquare } from 'lucide-react';
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
    }
  }, [isOpen]);

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
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-max overflow-y-scroll max-h-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Editar Perfil
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actualiza tu información personal
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={User}
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            {/* Rol */}
            <InputField
              icon={Briefcase}
              label="Rol / Título"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ej: Desarrollador Full Stack"
            />
            </div>


            {/* Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Ubicación y zona horaria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={MapPin}
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ciudad, País"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostrar Redes Sociales
                </label>
                <select
                  name="redes"
                  value={formData.redes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="siR">Si</option>
                  <option value="noR">No</option>
                </select>
            </div>

            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente InputField reutilizable
const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

export default EditProfileModal;