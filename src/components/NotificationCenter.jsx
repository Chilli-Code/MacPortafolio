import { Bell, X, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useWindowStore from "#store/window";
import { NOTIFICATIONS_SEED } from "#constants/index.js";

const NotificationCenter = ({ notifications, setNotifications }) => {
  
  const popRef = useRef();
  const { closeWindow } = useWindowStore();

  // 🔹 helpers compactos
  const notify = ({ app, title, message, icon }) => {
    speechSynthesis?.cancel();
    speechSynthesis?.speak(
      Object.assign(new SpeechSynthesisUtterance(`Notificación de ${app}. ${title}`), {
        lang: "es-ES",
        rate: 1.0,
        pitch: 1.0, // Tono normal
        volume: 1.0,
      })
    );

    Notification?.permission === "granted" &&
      new Notification(`${app}: ${title}`, { body: message, icon });
  };

  const addNotification = (data) => {
    const notification = { id: Date.now(), ...data };
    setNotifications((prev) => [notification, ...prev]);
    notify(notification);
  };

  // 🔹 permisos + simulación
  useEffect(() => {
    Notification?.permission === "default" &&
      Notification.requestPermission();

    const interval = setInterval(() => {
      addNotification(
        NOTIFICATIONS_SEED[
        Math.floor(Math.random() * NOTIFICATIONS_SEED.length)
        ]
      );
    }, 1000000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 animación + click outside
  useEffect(() => {
    gsap.fromTo(popRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0 });

    const onClick = (e) =>
      popRef.current &&
      !popRef.current.contains(e.target) &&
      gsap.to(popRef.current, {
        opacity: 0,
        x: 20,
        onComplete: () => closeWindow("modalMode"),
      });

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [closeWindow]);

  return (
    <div ref={popRef} className="fixed right-5 top-12 w-96 max-h-[calc(100vh-120px)] gap-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-[40px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-black dark:text-white">Notificaciones</h2>
            {!!notifications.length && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              addNotification(
                NOTIFICATIONS_SEED[
                Math.floor(Math.random() * NOTIFICATIONS_SEED.length)
                ]
              )
            }
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
          >
            Simular
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-3">
        {!notifications.length ? (
          <div className="text-center py-10 px-5">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay notificaciones
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div key={n.id} className="bg-white w-full dark:bg-gray-800 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] relative group">
                <button
                  onClick={() =>
                    setNotifications((prev) => prev.filter((x) => x.id !== n.id))
                  }
                  className="absolute top-2 right-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: n.color }}
                  >
                    {n.icon}
                  </div>

                  <div className="flex-1 flex-col min-w-0 items-start gap-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        {n.app}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                      {n.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {n.time}
                    </span>
                  </div>



                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">

        <button
          onClick={() => setNotifications([])}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1"
        >
          Borrar todas
        </button>
        <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-2 py-1"
        
        >
          Ajustes
        </button>
      </div>


    </div>
  );
};

export default NotificationCenter;
