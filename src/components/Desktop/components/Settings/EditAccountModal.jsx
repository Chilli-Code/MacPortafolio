// src/components/Settings/modals/EditAccountModal.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  X, Save, User, Mail, Phone, MapPin, Globe, 
  Linkedin, Github, Twitter, MessageSquare, Briefcase 
} from '#assets/icons';
import gsap from 'gsap';

const EditAccountModal = ({ isOpen, onClose, userData, onSave }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  const [formData, setFormData] = useState({
    username: userData?.username || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    type: userData?.type || '',
    location: userData?.location || '',
    website: userData?.website || '',
    timezone: userData?.timezone || 'America/Bogota',
    socialLinks: {
      github: userData?.github || '',
      linkedin: userData?.linkedin || '',
      twitter: userData?.twitter || '',
    }
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Animación de entrada
  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.25 }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, { 
      opacity: 0, 
      scale: 0.95, 
      y: 30, 
      duration: 0.25 
    });
    gsap.to(overlayRef.current, { 
      opacity: 0, 
      duration: 0.25, 
      onComplete: onClose 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'La URL debe comenzar con http:// o https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Aquí harías la petición PUT/PATCH a tu API
      const response = await fetch(`http://localhost:3001/users/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          type: formData.type,
          phone: formData.phone,
          location: formData.location,
          website: formData.website,
          timezone: formData.timezone,
          github: formData.socialLinks.github,
          linkedin: formData.socialLinks.linkedin,
          twitter: formData.socialLinks.twitter
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onSave(updatedUser);
        handleClose();
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-md overflow-y-auto p-4"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header estilo macOS */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="absolute left-4 top-5 flex gap-2">
            <button 
              onClick={handleClose} 
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition"
            />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <h2 className="text-center text-sm font-semibold text-gray-900 dark:text-white">
            Editar Información de Cuenta
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Información Personal
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <MacInputField
                icon={User}
                label="Nombre de usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />

              <MacInputField
                icon={Mail}
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <MacInputField
                icon={Phone}
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
              />

              <MacInputField
                icon={Briefcase}
                label="Rol / Puesto"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Frontend Developer"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <MacInputField
                icon={MapPin}
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Barranquilla, Colombia"
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  🌐 Zona Horaria
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="text-gray-900 dark:text-white w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="America/Bogota">🇨🇴 Colombia (GMT-5)</option>
                  <option value="America/New_York">🇺🇸 Nueva York (GMT-5)</option>
                  <option value="America/Los_Angeles">🇺🇸 Los Ángeles (GMT-8)</option>
                  <option value="Europe/Madrid">🇪🇸 Madrid (GMT+1)</option>
                  <option value="Europe/London">🇬🇧 Londres (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Enlaces y Redes Sociales
            </h3>

            <MacInputField
              icon={Globe}
              label="Sitio Web"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
              placeholder="https://tusitioweb.com"
            />

            <div className="grid md:grid-cols-3 gap-4">
              <MacInputField
                icon={Github}
                label="GitHub"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                placeholder="tu-usuario"
              />

              <MacInputField
                icon={Linkedin}
                label="LinkedIn"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="tu-usuario"
              />

              <MacInputField
                icon={Twitter}
                label="Twitter / X"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                placeholder="@tu_usuario"
              />
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de input reutilizable
const MacInputField = ({ icon: Icon, label, error, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
    </label>
    <input
      {...props}
      className={`text-gray-900 dark:text-white w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border text-sm focus:ring-2 focus:ring-blue-500 transition ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);

// Componente de textarea reutilizable
const MacTextAreaField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
    </label>
    <textarea
      {...props}
      className="text-gray-900 dark:text-white w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 transition resize-none"
    />
  </div>
);

export default EditAccountModal;