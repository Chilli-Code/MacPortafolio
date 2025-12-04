import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants/index.js";
import useWindowStore from "#store/window.js";
import ModalDarkLigt from "./ModalDarkLigt.jsx";


const Navbar = () => {
    const { openWindow } = useWindowStore();

    const [openMode, setOpenMode] = useState(false);
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
        <nav className="relative">  {/* solo agregamos relative */}
            <div>
                <img src="/images/logo.svg" alt="logo" />
                <p className="font-bold">ChillyCode Portafolio</p>

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
                src={img}
                alt={`icon-${id}`}
                className="icon-hover cursor-pointer"
                onClick={() => {
                    if (img === "/icons/mode.svg") {
                        setOpenMode((prev) => !prev);
                    }

                    if (img === "/icons/user.svg") {
                        openWindow("profile");  // ← AQUÍ ABRIMOS LA VENTANA DE PERFIL
                    }
                    if (img === "/icons/search.svg") {
                        openWindow("settings");  // ← AQUÍ ABRIMOS LA VENTANA DE PERFIL
                    }
                }}
            />
        </li>
    ))}
</ul>

                <time>{dayjs().format("ddd MMM D h:mm A")}</time>

                {/* 📌 MINI MODAL (agregada sin mover nada más) */}
                {openMode && (
                    <ModalDarkLigt />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
