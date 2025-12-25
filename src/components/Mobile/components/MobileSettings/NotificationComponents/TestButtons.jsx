// src/components/Mobile/components/MobileSettings/NotificationComponents/TestButtons.jsx
import { Bell, Check } from '#assets/icons';
import { useSystemNotificationStore } from '#components/SystemNotification';

const TestButtons = () => {
  const testBrowserNotification = () => {
    console.log('🧪 Testing browser notification...');
    
    if (!('Notification' in window)) {
      alert('❌ Tu navegador no soporta notificaciones');
      return;
    }
    
    if (Notification.permission !== 'granted') {
      alert(`⚠️ Permiso: ${Notification.permission}. Primero debes activar las notificaciones.`);
      return;
    }

    try {
      console.log('🎯 Creando notificación del navegador...');
      
      const notification = new Notification('🎉 Notificación de Prueba', {
        body: 'Esta es una notificación de prueba del navegador',
        icon: '/images/jorge-2.jpg',
        badge: '/images/jorge-2.jpg',
        tag: 'test-notification',
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200] // Patrón de vibración para móviles
      });

      console.log('✅ Browser notification created:', notification);
      
      // Sonido de éxito (opcional)
      try {
        const audio = new Audio('/sounds/success.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio error:', e));
      } catch (e) {
        console.log('Error playing sound:', e);
      }

      // Auto-cerrar después de 10 segundos
      setTimeout(() => {
        notification.close();
        console.log('🔒 Notificación cerrada');
      }, 10000);
      
      // Cerrar al hacer clic
      notification.onclick = () => {
        console.log('👆 Notificación clickeada');
        notification.close();
        window.focus();
      };
      
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      alert('Error al crear la notificación: ' + error.message);
    }
  };

  const testCustomNotification = () => {
    console.log('🧪 Testing custom notification...');
    
    useSystemNotificationStore.getState().addSystemNotification({
      type: 'success',
      app: 'Prueba',
      title: 'Notificación Personalizada',
      message: 'Esta es tu sistema de notificaciones interno',
      showTime: true,
      duration: 4000
    });
    
    console.log('✅ Custom notification sent');
  };

  return (
    <div className="m-4 mt-6 space-y-3">
      {/* Botón Notificación del Navegador */}
      <button
        onClick={testBrowserNotification}
        className="w-full py-3 bg-purple-500 active:bg-purple-600 text-white font-semibold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Bell className="w-5 h-5" />
        Probar Notificación del Navegador
      </button>
      
      {/* Botón Notificación Personalizada */}
      <button
        onClick={testCustomNotification}
        className="w-full py-3 bg-green-500 active:bg-green-600 text-white font-semibold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Check className="w-5 h-5" />
        Probar Notificación Personalizada
      </button>
      
      {/* Texto informativo */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
        La primera es la notificación nativa del navegador, la segunda es tu sistema personalizado
      </p>
    </div>
  );
};

export default TestButtons;