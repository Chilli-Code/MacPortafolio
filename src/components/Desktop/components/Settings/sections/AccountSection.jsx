// src/components/Settings/sections/AccountSection.jsx

import { 
  User, Mail, Lock, Phone, Linkedin, Github, 
  Twitter, Globe, MapPin, Briefcase, Calendar,
  Camera, Save, X, Edit, Shield, CreditCard,
  Bell, Eye, Trash2, LogOut
} from '#assets/icons';
import { useAppSettingsStore } from '#store/notificationStore';
import { useState, useRef } from 'react';

const AccountSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState('/images/jorge-2.jpg');
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    name: 'Jorge',
    email: 'jorge@ejemplo.com',
    phone: '+57 300 123 4567',
    bio: 'Desarrollador Full Stack especializado en React y Node.js',
    location: 'Barranquilla, Colombia',
    website: 'https://jorge.dev',
    linkedin: 'jorge-dev',
    github: 'jorge-dev',
    twitter: '@jorge_dev',
    hourlyRate: '$50',
    availability: 'Disponible',
    timezone: 'GMT-5',
    memberSince: 'Enero 2024'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Aquí guardarías en el backend
    console.log('Saving user data:', userData);
    setIsEditing(false);
    // Mostrar notificación de éxito
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-black dark:text-white text-2xl font-semibold mb-1 flex items-center gap-2 flex-wrap">
            <User className="w-6 h-6 text-blue-500" />
            Cuenta y Perfil
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra tu información personal y configuración de cuenta
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        )}
      </div>

      {/* Foto de Perfil */}
      <div className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className='grid gap-4' 
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}        
        >
        <div className="flex flex-col items-center gap-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Foto de Perfil
        </h3>
          <div className="relative">
            <img
              draggable={false}
              src={profileImage}
              alt="Profile"
              
              className="w-30 h-30 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {userData.name}
            </p>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Cambiar foto
              </button>
            )}
          </div>
        </div>
              {/* Información Personal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información Personal
        </h3>
        <div className="grid gap-4"        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'
        }}>
          <InputField
            icon={User}
            label="Nombre completo"
            value={userData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={!isEditing}
          />
          <InputField
            icon={Mail}
            label="Email"
            type="email"
            value={userData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
          />
          <InputField
            icon={Phone}
            label="Teléfono"
            value={userData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
          />
          <InputField
            icon={MapPin}
            label="Ubicación"
            value={userData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        
      </div>
        </div>
      </div>



      {/* Redes Sociales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Redes Sociales y Enlaces
        </h3>
        <div className="space-y-4">
          <InputField
            icon={Globe}
            label="Sitio Web"
            value={userData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            disabled={!isEditing}
            placeholder="https://tusitioweb.com"
          />
          <InputField
            icon={Linkedin}
            label="LinkedIn"
            value={userData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            disabled={!isEditing}
            placeholder="tu-usuario"
          />
          <InputField
            icon={Github}
            label="GitHub"
            value={userData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            disabled={!isEditing}
            placeholder="tu-usuario"
          />
          <InputField
            icon={Twitter}
            label="Twitter / X"
            value={userData.twitter}
            onChange={(e) => handleChange('twitter', e.target.value)}
            disabled={!isEditing}
            placeholder="@tu_usuario"
          />
        </div>
      </div>



      {/* Seguridad */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Seguridad
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Cambiar Contraseña
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Última actualización hace 3 meses
                </p>
              </div>
            </div>
            <Edit className="w-4 h-4 text-gray-400" />
          </button>

          <button className="w-full flex flex-wrap gap-2 items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Autenticación de Dos Factores
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aumenta la seguridad de tu cuenta
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
              Desactivado
            </div>
          </button>

        </div>
      </div>

      {/* Facturación (para freelancer) */}
      <div className="bg-white mb-20 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          Facturación y Pagos
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Métodos de Pago
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administra tus tarjetas y cuentas bancarias
                </p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Historial de Pagos
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ver todas tus transacciones
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>


      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

// Componente reutilizable de Input
const InputField = ({ icon: Icon, label, disabled, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        {...props}
        disabled={disabled}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  </div>
);

// Modal de Cambio de Contraseña
const PasswordChangeModal = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de cambio de contraseña
    console.log('Changing password:', passwords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white top-20 dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Cambiar Contraseña
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSection;