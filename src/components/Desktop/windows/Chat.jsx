import { WindowControls } from "#components/Desktop";
import { ChevronLeft, ChevronRight, Search, Send, User, Paperclip, Smile, Reply, Forward, Trash2, Star, Archive, MoreHorizontal, Mail } from "#assets/icons";
import WindowWrapper from "#hoc/WindowWrapper";
import { useState } from "react";
import clsx from "clsx";

const Gmail = ({ isMaximized, setIsMaximized }) => {
    // Datos simulados de emails estilo Gmail
    const emails = [
        {
            id: 1,
            from: "GitHub",
            subject: "Nueva actividad en tu repositorio",
            preview: "Se ha realizado un push a la rama main con 3 commits nuevos...",
            content: "Hola Jorge,\n\nSe ha detectado nueva actividad en tu repositorio 'mac-portafolio':\n\n• Commit: 'Fix notification center layout'\n• Commit: 'Add email-style chat component'\n• Commit: 'Update dependencies'\n\nPuedes ver los cambios en: https://github.com/jorge-dev/mac-portafolio\n\nSaludos,\nEl equipo de GitHub",
            date: "10:30 AM",
            isRead: false,
            isStarred: false,
            avatar: "/images/github-icon.png"
        },
        {
            id: 2,
            from: "LinkedIn",
            subject: "Tienes 3 nuevas invitaciones de conexión",
            preview: "Ana García, Carlos Rodríguez y María López quieren conectar contigo...",
            content: "Hola Jorge,\n\nTienes nuevas invitaciones pendientes:\n\n• Ana García - Desarrolladora Frontend\n• Carlos Rodríguez - Product Manager\n• María López - UX Designer\n\nAcepta las invitaciones para expandir tu red profesional.\n\nSaludos,\nLinkedIn Team",
            date: "9:15 AM",
            isRead: true,
            isStarred: true,
            avatar: "/images/linkedin-icon.png"
        },
        {
            id: 3,
            from: "Portfolio Admin",
            subject: "Nueva tarea disponible: Landing Page",
            preview: "Se ha publicado una nueva tarea en la plataforma...",
            content: "Estimado desarrollador,\n\nSe ha publicado una nueva tarea en la plataforma:\n\n📋 TAREA: Landing Page Deportiva\n💰 Recompensa: $250\n⏰ Deadline: 2025-01-15\n\nDescripción: Crear una landing page atractiva para una escuela de fútbol con secciones de:\n• Hero section con video\n• Servicios ofrecidos\n• Galería de fotos\n• Formulario de contacto\n\nRequisitos técnicos:\n- HTML5, CSS3, JavaScript\n- Diseño responsive\n- Optimización SEO básica\n- Integración con formulario de contacto\n\n¡Buena suerte!",
            date: "8:45 AM",
            isRead: false,
            isStarred: false,
            avatar: "/images/admin-avatar.jpg"
        },
        {
            id: 4,
            from: "Dribbble",
            subject: "Tu diseño ha recibido 15 likes",
            preview: "¡Felicitaciones! Tu último diseño en Dribbble está siendo muy popular...",
            content: "Hola Jorge,\n\n¡Excelente noticia! Tu diseño 'MacOS-inspired Portfolio' ha recibido 15 likes en las últimas 24 horas.\n\nEstadísticas:\n• 15 likes\n• 8 comentarios\n• 45 vistas\n\nLos usuarios están especialmente interesados en:\n- La interfaz de escritorio macOS\n- Las animaciones suaves\n- El diseño responsive\n\nSigue creando contenido increíble.\n\nSaludos,\nDribbble Team",
            date: "Ayer",
            isRead: true,
            isStarred: false,
            avatar: "/images/dribbble-icon.png"
        }
    ];

    const [activeEmail, setActiveEmail] = useState(emails[0]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [showReply, setShowReply] = useState(false);

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleReply = () => {
        if (replyContent.trim()) {
            // En un email real, esto enviaría la respuesta
            alert(`Respuesta enviada a ${activeEmail.from}: ${replyContent}`);
            setReplyContent("");
            setShowReply(false);
        }
    };

    const toggleStar = (emailId) => {
        // En un estado real, esto actualizaría la base de datos
        console.log(`Star toggled for email ${emailId}`);
    };

    const deleteEmail = (emailId) => {
        // En un estado real, esto movería a papelera
        alert(`Email ${emailId} movido a papelera`);
    };

    const archiveEmail = (emailId) => {
        // En un estado real, esto archivaría el email
        alert(`Email ${emailId} archivado`);
    };

    const renderEmailList = () => (
        <div className="px-2">
            <div className="flex justify-between items-center mb-3 px-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Inbox
                </h3>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {emails.filter(e => !e.isRead).length}
                </span>
            </div>

            <ul className="flex flex-col gap-1">
                {emails.map((email) => (
                    <li
                        key={email.id}
                        title={`${email.from}\n${email.subject}`}
                        onClick={() => setActiveEmail(email)}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group",
                            email.id === activeEmail.id
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/30",
                            !email.isRead && "bg-gray-50 dark:bg-gray-800/50"
                        )}
                    >
                        {/* Checkbox para selección */}
                        <input
                            type="checkbox"
                            checked={selectedEmails.includes(email.id)}
                            onChange={(e) => {
                                e.stopPropagation();
                                setSelectedEmails(prev =>
                                    prev.includes(email.id)
                                        ? prev.filter(id => id !== email.id)
                                        : [...prev, email.id]
                                );
                            }}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />

                        {/* Estrella */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(email.id);
                            }}
                            className={clsx(
                                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                email.isStarred ? "text-yellow-500" : "text-gray-400"
                            )}
                        >
                            <Star className={clsx("w-4 h-4", email.isStarred && "fill-current")} />
                        </button>

                        {/* Avatar del remitente */}
                        <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                {email.avatar ? (
                                    <img
                                        src={email.avatar}
                                        alt={email.from}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        {email.from.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {!email.isRead && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className={clsx(
                                    "text-sm font-medium truncate",
                                    email.id === activeEmail.id
                                        ? "text-blue-700 dark:text-blue-300"
                                        : "text-gray-900 dark:text-gray-100",
                                    !email.isRead && "font-semibold"
                                )}>
                                    {email.from}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                    {email.date}
                                </span>
                            </div>
                            <p className={clsx(
                                "text-sm truncate",
                                email.id === activeEmail.id
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300",
                                !email.isRead && "font-medium"
                            )}>
                                {email.subject}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {email.preview}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <div id="window-header" className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">

                <WindowControls target="gmail" onMaximize={handleMaximize} />

                <h2 className="flex items-center gap-2 justify-center">
                    <Mail size={20} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-white">Correos</span>
                </h2>

            </div>
            <div className="flex-1 min-w-0 overflow-x-hidden bg-gray-50 dark:bg-gray-800 bordertp">
                <div className="ft flex justify-between items-center border-r border-gray-200 dark:border-gray-700 h-full border-b-w-0px px-4 !py-1">

                    {/* Barra de herramientas estilo Gmail */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => selectedEmails.forEach(id => archiveEmail(id))}
                            disabled={!selectedEmails.length}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                            title="Archivar"
                        >
                            <Archive className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => selectedEmails.forEach(id => deleteEmail(id))}
                            disabled={!selectedEmails.length}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg py-2 px-3 w-64">
                        <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Buscar emails..."
                            className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 bg-white dark:bg-gray-900 h-full">
                {/* Sidebar - Inbox */}
                <div className="w-80 px-2 sidebarFolder flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto py-4">
                    {renderEmailList()}
                </div>

                {/* Email Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* Email Header */}
                    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                                {activeEmail.subject}
                            </h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleStar(activeEmail.id)}
                                    className={clsx(
                                        "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                        activeEmail.isStarred ? "text-yellow-500" : "text-gray-400"
                                    )}
                                >
                                    <Star className={clsx("w-5 h-5", activeEmail.isStarred && "fill-current")} />
                                </button>
                                <button
                                    onClick={() => archiveEmail(activeEmail.id)}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Archivar"
                                >
                                    <Archive className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => deleteEmail(activeEmail.id)}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                {activeEmail.avatar ? (
                                    <img
                                        src={activeEmail.avatar}
                                        alt={activeEmail.from}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {activeEmail.from.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {activeEmail.from}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        &lt;{activeEmail.from.toLowerCase().replace(/\s+/g, '.')}@example.com&gt;
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        para mí
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {activeEmail.date}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4">
                            <button
                                onClick={() => setShowReply(!showReply)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Reply className="w-4 h-4" />
                                Responder
                            </button>
                            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                <Forward className="w-4 h-4" />
                                Reenviar
                            </button>
                        </div>
                    </div>

                    {/* Email Content */}
                    <div className="flex-shrink-0 px-6 py-6 bg-white dark:bg-gray-900">
                        <div className="max-w-4xl">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {activeEmail.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reply Composer */}
                    {showReply && (
                        <div className="flex-shrink-0 mb-22 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl">
                            <div className="px-6 py-4">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Responder a {activeEmail.from}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Escribe tu respuesta..."
                                            className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none resize-none"
                                            rows="8"
                                        />
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center gap-2">
                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                                                    <Paperclip className="w-4 h-4" />
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                                                    <Smile className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShowReply(false)}
                                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleReply}
                                                    disabled={!replyContent.trim()}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                                                >
                                                    Enviar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const GmailWindow = WindowWrapper(Gmail, "gmail");

export default GmailWindow;