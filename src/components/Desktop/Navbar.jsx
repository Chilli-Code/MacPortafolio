import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants/index.js";
import useWindowStore from "#store/window.js";
import NotificationCenter from "../NotificationCenter.jsx";
import LogoutModal from "../LogoutModal.jsx";

const Navbar = ({ onLogout }) => {
    const { openWindow } = useWindowStore();
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

    return (
        <nav className="relative"> 
            <div>
                <button className="cursor-pointer"
                onClick={() => setShowLogoutModal(true)}
                >
                <img draggable={false} src="/images/logo.svg" alt="logo" />

                </button>
                <p className="font-bold">Keku Enterprise</p>

                <ul>
                    {navLinks.map(({ id, name, type }) => (
                        <li key={id} onClick={() => openWindow(type)}>
                            <p>{name}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative">
                <ul>
                    {navIcons.map(({ id, img }) => (
                        <li key={id}>
                            <img
                                draggable={false}
                                src={img}
                                alt={`icon-${id}`}
                                className="icon-hover cursor-pointer"
                                onClick={() => {
                                    if (img === "/icons/mode.svg") {
                                        setOpenMode((prev) => !prev);
                                    }

                                    if (img === "/icons/user.svg") {
                                        openWindow("profile");
                                    }
                                    if (img === "/icons/settings-mac.svg") {
                                        openWindow("settings"); 
                                    }
                                    if (img === "/icons/wifi.svg") {
                                        openWindow("gmail");
                                    }                                   
                                }}
                            />
                                {img === "/icons/mode.svg" && notifications.length > 0 && (
                                <span className="absolute bottom-2 left-28 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

                <time>{dayjs().format("ddd MMM D h:mm A")}</time>

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
