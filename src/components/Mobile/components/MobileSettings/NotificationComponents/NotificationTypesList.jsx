// src/components/Mobile/components/MobileSettings/NotificationComponents/NotificationTypesList.jsx
import NotificationTypeItem from './NotificationTypeItem';

const NotificationTypesList = () => {
  const notificationTypes = [
    {
      id: 'achievements',
      emoji: '🏆',
      title: 'Logros y Medallas',
      subtitle: 'Cuando desbloqueas un nuevo logro',
      enabled: true
    },
    {
      id: 'tasks',
      emoji: '✅',
      title: 'Tareas Completadas',
      subtitle: 'Cuando finalizas una tarea',
      enabled: true
    },
    {
      id: 'rejected',
      emoji: '⚠️',
      title: 'Tareas Rechazadas',
      subtitle: 'Cuando una tarea es rechazada',
      enabled: true
    },
    {
      id: 'payments',
      emoji: '💰',
      title: 'Pagos Recibidos',
      subtitle: 'Cuando recibes un pago',
      enabled: true
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
        TIPOS DE NOTIFICACIONES
      </h3>
      
      <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        {notificationTypes.map((type, index) => (
          <NotificationTypeItem
            key={type.id}
            emoji={type.emoji}
            title={type.title}
            subtitle={type.subtitle}
            enabled={type.enabled}
            isLast={index === notificationTypes.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationTypesList;