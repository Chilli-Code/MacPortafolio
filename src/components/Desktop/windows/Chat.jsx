import { WindowControls } from "#components/Desktop";
import { ChevronLeft, ChevronRight, Search, Send, User, Paperclip, Smile } from "#assets/icons";
import WindowWrapper from "#hoc/WindowWrapper";
import { useState } from "react";
import { usersChat } from "#constants";
import clsx from "clsx";

const Chat = ({ isMaximized, setIsMaximized }) => {
    const [activeItem, setActiveItem] = useState(usersChat[0]);

    const [messages, setMessages] = useState([
        { sender: "user", content: "¡Hola! ¿Cómo estás?" },
        { sender: "bot", content: "¡Hola! Estoy bien, gracias. ¿Y tú?" },
        { sender: "user", content: "Todo bien, trabajando en el proyecto" },
        { sender: "bot", content: "Genial, ¿necesitas ayuda con algo?" },
        { sender: "user", content: "Sí, estoy ajustando el diseño del chat" },
        { sender: "bot", content: "Perfecto, cuéntame qué necesitas" },
    ]);
    const [messageInput, setMessageInput] = useState("");

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            setMessages([...messages, { sender: "user", content: messageInput }]);
            setMessageInput("");
        }
    };

    const renderList = (name, items) => (
        <div className="px-2">
            <div className="flex justify-between items-center mb-3 px-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {name}
                </h3>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {items.length}
                </span>
            </div>

            <ul className="flex flex-col gap-1">
                {items.map((item) => (
                    <li
                        key={item.id}
                        title={`${item.name} - ${item.role}`}
                        onClick={() => setActiveItem(item)}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                            item.id === activeItem.id
                                ? "bg-blue-500 text-white shadow-sm"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                        )}
                    >
                        {/* Foto del usuario con estado online */}
                        <div className="relative">
                            <img
                                draggable={false}
                                src={item.avatar}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                        </div>
                        
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {item.name}
                            </p>
                            <p className={clsx(
                                "text-xs truncate",
                                item.id === activeItem.id 
                                    ? "text-blue-100" 
                                    : "text-gray-500 dark:text-gray-400"
                            )}>
                                {item.role}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <div id="window-header" className="p-0 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                <div className="h-full w-48 px-6 ttt  !bg-gray-50 resize-handle dark:!bg-gray-800">
                    <WindowControls target="chat" onMaximize={handleMaximize} />
                </div>

                <div className="flex-1 min-w-0 overflow-x-hidden bordertp">
                    <div className="ft flex justify-between items-center border-r border-gray-200 dark:border-gray-700 h-full border-b-w-0px px-4 !py-1">
                        <div className="resize-handle">
                            <User size={20} className="text-gray-600 dark:text-gray-300"/>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg py-2 px-2 w-64">
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="flex-1 bg-transparent text-black dark:text-white border-b border-gray-400 dark:border-gray-600 focus:outline-none z-90"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 bg-white dark:bg-gray-900 h-full">
                {/* Sidebar */}
                <div className="w-48 px-2 sidebarFolder flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto py-4">
                    {renderList("Chats", usersChat)}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Messages Container - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 bg-white dark:bg-gray-900">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === "bot" && (
                                        <img
                                            draggable={false}
                                            src={activeItem.avatar}
                                            alt={activeItem.name}
                                            className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
                                        />
                                    )}
                                    
                                    <div
                                        className={clsx(
                                            "px-4 py-2.5 rounded-2xl max-w-md text-sm shadow-sm",
                                            msg.sender === "user"
                                                ? "bg-blue-500 text-white rounded-br-sm"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                                        )}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.sender === "user" && (
                                        <div className="w-8 h-8 ml-2 mt-1" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Input Area - Fixed at bottom */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl mb-12">
                        <div className="px-6 py-4">
                            <div className="flex items-end gap-3 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 p-3">
                                {/* Attachments Button */}
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                                    <Paperclip className="w-5 h-5" />
                                </button>

                                {/* Text Input */}
                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none max-h-32"
                                    placeholder="Escribe un mensaje..."
                                    rows="1"
                                    style={{ minHeight: '24px' }}
                                />

                                {/* Emoji Button */}
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                                    <Smile className="w-5 h-5" />
                                </button>

                                {/* Send Button */}
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    disabled={!messageInput.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ChatWindow = WindowWrapper(Chat, "chat");

export default ChatWindow;