// src/components/Navbar.jsx - OPCIÓN A: PUNTO AMARILLO EN ÍCONOS EXISTENTES

import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants/index.js";
import useWindowStore from "#store/window.js";
import NotificationCenter from "../NotificationCenter.jsx";
import LogoutModal from "../LogoutModal.jsx";

const Navbar = ({ onLogout }) => {
    const { openWindow, restoreWindow, windows } = useWindowStore(); // 👈 Agregar restoreWindow y windows
    const [notifications, setNotifications] = useState([]);
    const [openMode, setOpenMode] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const popRef = useRef();

    useEffect(() => {
        const handleClick = (e) => {
            if (popRef.current && !popRef.current.contains(e.target)) {
                setOpenMode(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // 👇 FUNCIÓN MEJORADA PARA MANEJAR CLICKS EN VENTANAS
    const handleWindowClick = (type) => {
        const window = windows[type];
        
        if (window?.isOpen && window?.isMinimized) {
            // ⭐ Si está minimizada, restaurarla
            restoreWindow(type);
        } else {
            // Si no está abierta o está visible, abrirla normalmente
            openWindow(type);
        }
    };

    return (
        <nav className="relative"> 
            <div>
                <button 
                    className="cursor-pointer"
                    onClick={() => setShowLogoutModal(true)}
                >
                    <img draggable={false} src="/images/logo.svg" alt="logo" />
                </button>
                <p className="font-bold">Keku Enterprise</p>

                <ul>
                    {navLinks.map(({ id, name, type }) => {
                        const window = windows[type];
                        const isMinimized = window?.isOpen && window?.isMinimized;

                        return (
                            <li 
                                key={id} 
                                onClick={() => handleWindowClick(type)}
                                className="relative" // 👈 Necesario para el posicionamiento del punto
                            >
                                <p>{name}</p>
                                
                                {/* 👇 PUNTO AMARILLO SI ESTÁ MINIMIZADA */}
                                {isMinimized && (
                                    <span 
                                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"
                                        title={`${name} minimizada - Click para restaurar`}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="relative">
                <ul>
                    {navIcons.map(({ id, img }) => {
                        // 👇 Mapear ícono a tipo de ventana
                        let windowType = null;
                        if (img === "/icons/user.svg") windowType = "profile";
                        if (img === "/icons/settings-mac.svg") windowType = "settings";
                        if (img === "/icons/wifi.svg") windowType = "gmail";

                        const window = windowType ? windows[windowType] : null;
                        const isMinimized = window?.isOpen && window?.isMinimized;

                        return (
                            <li key={id} className="relative">
                                <img
                                    draggable={false}
                                    src={img}
                                    alt={`icon-${id}`}
                                    className="icon-hover cursor-pointer"
                                    onClick={() => {
                                        if (img === "/icons/mode.svg") {
                                            setOpenMode((prev) => !prev);
                                        }
                                        else if (img === "/icons/user.svg") {
                                            handleWindowClick("profile");
                                        }
                                        else if (img === "/icons/settings-mac.svg") {
                                            handleWindowClick("settings");
                                        }
                                        else if (img === "/icons/wifi.svg") {
                                            handleWindowClick("gmail");
                                        }                                   
                                    }}
                                />

                                {/* Badge de notificaciones (solo para mode.svg) */}
                                {img === "/icons/mode.svg" && notifications.length > 0 && (
                                    <span className="absolute bottom-2 left-28 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}

                                {/* 👇 PUNTO AMARILLO SI ESTÁ MINIMIZADA */}
                                {isMinimized && (
                                    <span 
                                        className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"
                                        title="Ventana minimizada - Click para restaurar"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>

                <time 
                    onClick={() => handleWindowClick("calendar")}
                    className="relative cursor-pointer"
                >
                    {dayjs().format("ddd MMM D h:mm A")}
                    
                    {/* 👇 PUNTO AMARILLO PARA CALENDAR MINIMIZADO */}
                    {windows.calendar?.isOpen && windows.calendar?.isMinimized && (
                        <span 
                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"
                            title="Calendar minimizado - Click para restaurar"
                        />
                    )}
                </time>

                {openMode && (
                    <NotificationCenter
                        notifications={notifications}
                        setNotifications={setNotifications} 
                    />
                )}
            </div>
            
            {showLogoutModal && (
                <LogoutModal
                    onClose={() => setShowLogoutModal(false)}
                    onLogout={onLogout}
                />
            )}
        </nav>
    );
};

export default Navbar;