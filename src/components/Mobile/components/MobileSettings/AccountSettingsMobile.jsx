// src/components/Mobile/components/MobileSettings/AccountSettingsMobile.jsx
import { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, ChevronRight,
  Camera, Linkedin, Github, Twitter, Lock, Shield,
  CreditCard, LogOut, Trash2, X, Check
} from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';

const AccountSettingsMobile = ({ onBack }) => {
  const [activeModal, setActiveModal] = useState(null); // 'password', 'delete', etc
  const [profileImage, setProfileImage] = useState('/images/jorge-2.jpg');
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    name: 'Jorge Martínez',
    email: 'jorge@ejemplo.com',
    phone: '+57 300 123 4567',
    location: 'Barranquilla, Colombia',
    website: 'https://jorge.dev',
    linkedin: 'jorge-dev',
    github: 'jorge-dev',
    twitter: '@jorge_dev',
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

  const settingsGroups = [
    {
      title: 'INFORMACIÓN PERSONAL',
      items: [
        { id: 'name', label: 'Nombre', value: userData.name, icon: User, editable: true },
        { id: 'email', label: 'Email', value: userData.email, icon: Mail, editable: true },
        { id: 'phone', label: 'Teléfono', value: userData.phone, icon: Phone, editable: true },
        { id: 'location', label: 'Ubicación', value: userData.location, icon: MapPin, editable: true },
      ]
    },
    {
      title: 'REDES SOCIALES',
      items: [
        { id: 'website', label: 'Sitio Web', value: userData.website, icon: Globe, editable: true },
        { id: 'linkedin', label: 'LinkedIn', value: userData.linkedin, icon: Linkedin, editable: true },
        { id: 'github', label: 'GitHub', value: userData.github, icon: Github, editable: true },
        { id: 'twitter', label: 'Twitter', value: userData.twitter, icon: Twitter, editable: true },
      ]
    },
    {
      title: 'SEGURIDAD',
      items: [
        { 
          id: 'password', 
          label: 'Contraseña', 
          value: '••••••••', 
          icon: Lock, 
          action: () => setActiveModal('password'),
          subtitle: 'Última actualización hace 3 meses'
        },
        { 
          id: '2fa', 
          label: 'Autenticación 2FA', 
          value: 'Desactivado', 
          icon: Shield, 
          action: () => {},
          badge: { text: 'Desactivado', color: 'yellow' }
        },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
      {/* Header */}
      <MobileNav 
        title="Cuenta"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Photo Section */}
        <div className="bg-white dark:bg-gray-900 py-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
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
            <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
              {userData.name}
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-sm text-blue-500 font-medium active:opacity-50 transition-opacity"
            >
              Cambiar foto
            </button>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mt-6">
            {/* Group Title */}
            <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
              {group.title}
            </h3>

            {/* Items */}
            <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === group.items.length - 1;

                return (
                  <button
                    key={item.id}
                    onClick={() => item.action?.() || setActiveModal(item.id)}
                    className={`w-full px-4 py-3 active:bg-gray-100 dark:active:bg-gray-800 transition-colors ${
                      !isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.badge ? (
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${item.badge.color === 'yellow' 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }
                          `}>
                            {item.badge.text}
                          </span>
                        ) : item.value ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            {item.value}
                          </span>
                        ) : null}
                        
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="mt-6 mb-6">
          <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
            ZONA PELIGROSA
          </h3>
          
          <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveModal('logout')}
              className="w-full px-4 py-3 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Cerrar Sesión
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('delete')}
              className="w-full px-4 py-3 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Eliminar Cuenta
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Member Since */}
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            Miembro desde {userData.memberSince}
          </p>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'password' && <PasswordModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'logout' && <LogoutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'delete' && <DeleteAccountModal onClose={() => setActiveModal(null)} />}
      {activeModal && !['password', 'logout', 'delete'].includes(activeModal) && (
        <EditFieldModal
          field={settingsGroups.flatMap(g => g.items).find(i => i.id === activeModal)}
          userData={userData}
          onSave={(field, value) => {
            setUserData(prev => ({ ...prev, [field]: value }));
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

// Modal de Editar Campo
const EditFieldModal = ({ field, userData, onSave, onClose }) => {
  const [value, setValue] = useState(userData[field?.id] || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end" onClick={onClose}>
      <div 
        className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-blue-500 font-medium">
            Cancelar
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {field?.label}
          </h3>
          <button 
            onClick={() => onSave(field.id, value)}
            className="text-blue-500 font-semibold"
          >
            Guardar
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Ingresa tu ${field?.label.toLowerCase()}`}
          autoFocus
        />
      </div>
    </div>
  );
};

// Modal de Cambiar Contraseña
const PasswordModal = ({ onClose }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSubmit = () => {
    console.log('Changing password:', passwords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end" onClick={onClose}>
      <div 
        className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-blue-500 font-medium">
            Cancelar
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cambiar Contraseña
          </h3>
          <button onClick={handleSubmit} className="text-blue-500 font-semibold">
            Listo
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
            placeholder="Contraseña actual"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
            placeholder="Nueva contraseña"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          La contraseña debe tener al menos 8 caracteres
        </p>
      </div>
    </div>
  );
};

// Modal de Cerrar Sesión
const LogoutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          ¿Cerrar Sesión?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Tendrás que iniciar sesión nuevamente para acceder a tu cuenta
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              console.log('Logging out...');
              onClose();
            }}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl active:scale-95 transition-all"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl active:scale-95 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Eliminar Cuenta
const DeleteAccountModal = ({ onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText === 'ELIMINAR';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Eliminar Cuenta
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Esta acción es permanente. Todos tus datos serán eliminados y no podrás recuperarlos.
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Escribe <strong>ELIMINAR</strong> para confirmar:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="ELIMINAR"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (canDelete) {
                console.log('Deleting account...');
                onClose();
              }
            }}
            disabled={!canDelete}
            className={`w-full py-3 font-semibold rounded-xl active:scale-95 transition-all ${
              canDelete
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            Eliminar Permanentemente
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl active:scale-95 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsMobile;