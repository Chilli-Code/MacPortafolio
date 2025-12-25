import { useState } from 'react';
import { ChevronRight, User, Palette, Bell, Globe, CreditCard, Shield } from '#assets/icons';

// Importar secciones
import AppearanceSettingsMobile from '#components/Mobile/components/MobileSettings/AppearanceSettingsMobile';
import MobileNav from '#Mobile/MobileNav';

import NotificationsSettingsMobile from '#components/Mobile/components/MobileSettings/NotificationsSettingsMobile';
import AccountSettingsMobile from '#components/Mobile/components/MobileSettings/AccountSettingsMobile';
import LanguageSettingsMobile from '#components/Mobile/components/MobileSettings/LanguageSettingsMobile';
import PaymentSettingsMobile from '#components/Mobile/components/MobileSettings/PaymentSettingsMobile';

const SettingsScreen = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState(null);

  const settingsGroups = [
    {
      title: 'Personal',
      items: [
        { id: 'account', title: 'Cuenta y Perfil', icon: User, color: 'text-blue-500', bg: 'bg-blue-100' },
        { id: 'appearance', title: 'Apariencia', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-100' },
      ]
    },
    {
      title: 'Preferencias',
      items: [
        { id: 'notifications', title: 'Notificaciones', icon: Bell, color: 'text-red-500', bg: 'bg-red-100' },
        { id: 'language', title: 'Idioma', icon: Globe, color: 'text-green-500', bg: 'bg-green-100' },
      ]
    },
    {
      title: 'Pagos',
      items: [
        { id: 'payment', title: 'Métodos de Pago', icon: CreditCard, color: 'text-yellow-500', bg: 'bg-yellow-100' },
      ]
    }
  ];

  const renderSection = () => {
    const handleClose = () => setActiveSection(null);

    switch (activeSection) {
      case 'account':
        return <AccountSettingsMobile onBack={handleClose} />;
      case 'appearance':
        return <AppearanceSettingsMobile onBack={handleClose} />;
      case 'notifications':
      return <NotificationsSettingsMobile onBack={handleClose} />;
      case 'language':
      return <LanguageSettingsMobile onBack={handleClose} />;
      case 'payment':
      return <PaymentSettingsMobile onBack={handleClose} />;
      default:
        return null;
    }
  };

  if (activeSection) {
    return renderSection();
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <MobileNav
        title="Configuración"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mt-6">
            {/* Group Title */}
            <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {group.title}
            </h3>

            {/* Items */}
            <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === group.items.length - 1;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-gray-700 transition-colors ${
                      !isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${item.bg} dark:opacity-80 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Version Info */}
        <div className="mt-8 mb-6 text-center">
          <p className="text-xs text-gray-400">Versión 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2025 Tu Empresa</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;