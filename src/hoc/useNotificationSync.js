// src/hooks/useNotificationSync.js
import { useEffect, useRef } from 'react';
import { useTasksStore } from '#store/tasksStore';
import { useAppSettingsStore } from '#store/appSettingsStore';
import api from '../service/apis';

export const useNotificationSync = (addNotification, openWindow, closeWindow) => {
  const { hasNewTasks, notifyNewTasks } = useTasksStore();
  const { notificationsEnabled } = useAppSettingsStore();
  const lastGlobalNotificationCheck = useRef(localStorage.getItem('lastGlobalNotificationCheck') || '0');

  useEffect(() => {
    // Verificar nuevas tareas cada 5 segundos
    const checkNewTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks?status=available');
        const tasks = await response.json();

        // Obtener timestamp de última verificación
        const lastCheck = localStorage.getItem('lastTaskCheck');
        const currentTime = new Date().getTime();

        if (tasks.length > 0) {
          // Verificar si hay tareas nuevas desde la última vez
          const newTasks = tasks.filter(task => {
            const taskCreated = new Date(task.createdAt || task.id).getTime();
            return !lastCheck || taskCreated > parseInt(lastCheck);
          });

          if (newTasks.length > 0 && lastCheck) {
            // Hay tareas nuevas, notificar
            addNotification({
              app: "SISTEMA",
              title: "🚀 Nuevas tareas disponibles",
              message: `${newTasks.length} nueva(s) tarea(s). Abre la Terminal y ejecuta 'tasks fetch'`,
              icon: "📋",
              color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              time: "Ahora",
              action: () => {
                closeWindow("modalMode");
                openWindow("terminal");
              }
            });
          }
        }

        // Actualizar timestamp
        localStorage.setItem('lastTaskCheck', currentTime.toString());
      } catch (error) {
        console.error('Error checking new tasks:', error);
      }
    };

    // 📢 Verificar notificaciones globales cada 3 segundos
    const checkGlobalNotifications = async () => {
      try {
        const globalNotifications = await api.getGlobalNotifications();

        // Filtrar notificaciones más nuevas que la última verificación
        const lastCheck = parseInt(lastGlobalNotificationCheck.current);
        const newGlobalNotifications = globalNotifications.filter(notification => {
          const notificationTime = new Date(notification.createdAt).getTime();
          return notificationTime > lastCheck;
        });

        // Mostrar cada nueva notificación global
        newGlobalNotifications.forEach(notification => {
          addNotification({
            app: "SISTEMA GLOBAL",
            title: notification.title,
            message: notification.message,
            icon: notification.icon,
            color: notification.color,
            time: "Ahora",
            action: notification.action?.type === "open_terminal" ? () => {
              closeWindow("modalMode");
              openWindow("terminal");
            } : undefined,
            globalId: notification.id // Para poder descartar
          });
        });

        // Actualizar timestamp de última verificación
        if (globalNotifications.length > 0) {
          const latestNotification = globalNotifications.reduce((latest, current) =>
            new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
          );
          lastGlobalNotificationCheck.current = new Date(latestNotification.createdAt).getTime().toString();
          localStorage.setItem('lastGlobalNotificationCheck', lastGlobalNotificationCheck.current);
        }
      } catch (error) {
        console.error('Error checking global notifications:', error);
      }
    };

    // Verificar al montar
    checkNewTasks();
    checkGlobalNotifications();

    // Polling cada 3 segundos para tareas, cada 5 segundos para notificaciones globales
    const taskInterval = setInterval(checkNewTasks, 3000);
    const globalNotificationInterval = setInterval(checkGlobalNotifications, 5000);

    return () => {
      clearInterval(taskInterval);
      clearInterval(globalNotificationInterval);
    };
  }, [addNotification, openWindow, closeWindow]);
};