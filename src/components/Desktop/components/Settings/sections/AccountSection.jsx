// src/components/Settings/sections/AccountSection.jsx

import { 
  User, Mail, Lock, Phone, Linkedin, Github, 
  Twitter, Globe, MapPin, Briefcase, Calendar,
  Camera, Save, X, Edit, Shield, CreditCard
} from '#assets/icons';
import { useState, useRef, useEffect } from 'react';
import EditAccountModal from '../EditAccountModal';

const AccountSection = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState('/images/jorge-2.jpg');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/users/usr_001');
        const data = await response.json();
        setUserData(data);
        // Si el usuario tiene avatar, usarlo
if (data.avatar && data.avatar !== null) {
  setProfileImage(data.avatar);
} else {
  setProfileImage(null); // Sin imagen = mostrar inicial
}
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleSaveUser = (updatedUser) => {
    setUserData(updatedUser);
    // TODO: Mostrar notificación de éxito
    console.log('Usuario actualizado:', updatedUser);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // TODO: Aquí subirías la imagen al servidor
        // updateUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        Error al cargar los datos del usuario
      </div>
    );
  }

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
        
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Perfil
        </button>
      </div>

      {/* Foto de Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Foto de Perfil
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
<div className="relative">
  {profileImage && profileImage !== '/images/jorge-2.jpg' ? (
    <img
      draggable={false}
      src={profileImage}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-200 dark:ring-gray-700">
      <span className="text-4xl font-bold text-white">
        {userData.fullName?.charAt(0).toUpperCase() || 'U'}
      </span>
    </div>
  )}
  <button
    onClick={() => fileInputRef.current?.click()}
    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
  >
    <Camera className="w-4 h-4 text-white" />
  </button>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
</div>
          
          <div className="flex-1 text-center sm:text-left">
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {userData.fullName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {userData.email}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Cambiar foto de perfil
            </button>
          </div>
        </div>
      </div>

      {/* Información Personal - Vista de solo lectura */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información Personal
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoDisplay
            icon={User}
            label="Nombre completo"
            value={userData.fullName}
          />
          <InfoDisplay
            icon={Mail}
            label="Email"
            value={userData.email}
          />
          <InfoDisplay
            icon={Phone}
            label="Teléfono"
            value={userData.profile?.phone || 'No especificado'}
          />
          <InfoDisplay
            icon={MapPin}
            label="Ubicación"
            value={userData.profile?.location || 'No especificada'}
          />
          <InfoDisplay
            icon={Briefcase}
            label="Rol"
            value={userData.role || 'No especificado'}
          />
          <InfoDisplay
            icon={Globe}
            label="Zona Horaria"
            value={userData.profile?.timezone || 'No especificada'}
          />
        </div>
      </div>

      

      {/* Redes Sociales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Redes Sociales y Enlaces
        </h3>
        <div className="space-y-3">
          {userData.profile?.website && (
            <SocialLink
              icon={Globe}
              label="Sitio Web"
              value={userData.profile.website}
              href={userData.profile.website}
            />
          )}
          {userData.profile?.socialLinks?.github && (
            <SocialLink
              icon={Github}
              label="GitHub"
              value={`@${userData.profile.socialLinks.github}`}
              href={`https://github.com/${userData.profile.socialLinks.github}`}
            />
          )}
          {userData.profile?.socialLinks?.linkedin && (
            <SocialLink
              icon={Linkedin}
              label="LinkedIn"
              value={userData.profile.socialLinks.linkedin}
              href={`https://linkedin.com/in/${userData.profile.socialLinks.linkedin}`}
            />
          )}
          {userData.profile?.socialLinks?.twitter && (
            <SocialLink
              icon={Twitter}
              label="Twitter / X"
              value={userData.profile.socialLinks.twitter}
              href={`https://twitter.com/${userData.profile.socialLinks.twitter.replace('@', '')}`}
            />
          )}
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

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
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

      {/* Facturación */}
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

      {/* Modales */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveUser}
      />

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

// Componente para mostrar información (solo lectura)
const InfoDisplay = ({ icon: Icon, label, value }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
      {label}
    </label>
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm text-gray-900 dark:text-white truncate">
        {value}
      </span>
    </div>
  </div>
);

// Componente para enlaces de redes sociales
const SocialLink = ({ icon: Icon, label, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  </a>
);

// Modal de Cambio de Contraseña
const PasswordChangeModal = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // TODO: Implementar cambio de contraseña
    console.log('Changing password:', passwords);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
              minLength={8}
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
              minLength={8}
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