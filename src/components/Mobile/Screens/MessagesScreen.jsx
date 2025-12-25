// src/components/Mobile/screens/MessagesScreen.jsx
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Image, Plus, Send, Mic } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';

const MessagesScreen = ({ onBack }) => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Admin Sistema',
      avatar: '👨‍💼',
      lastMessage: 'Tu tarea ha sido aprobada',
      time: '2:30 PM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Equipo Frontend',
      avatar: '👥',
      lastMessage: 'Reunión mañana a las 10:00',
      time: '11:45 AM',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Jorge Martínez',
      avatar: '👤',
      lastMessage: '¿Viste el nuevo diseño?',
      time: 'Ayer',
      unread: 0,
      online: true
    },
    {
      id: 4,
      name: 'Soporte Técnico',
      avatar: '🛠️',
      lastMessage: 'Hemos resuelto tu ticket',
      time: 'Lunes',
      unread: 1,
      online: false
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar mensajes de ejemplo cuando se selecciona un chat
  useEffect(() => {
    if (selectedChat) {
      setMessages([
        {
          id: 1,
          text: '¡Hola! ¿Cómo va tu tarea?',
          sender: 'other',
          time: '10:30 AM',
          delivered: true,
          read: true
        },
        {
          id: 2,
          text: '¡Muy bien! Ya casi termino',
          sender: 'me',
          time: '10:32 AM',
          delivered: true,
          read: true
        },
        {
          id: 3,
          text: 'Excelente trabajo 👏',
          sender: 'other',
          time: '10:35 AM',
          delivered: true,
          read: true
        },
        {
          id: 4,
          text: 'Gracias! Te mando el progreso en un momento',
          sender: 'me',
          time: '10:36 AM',
          delivered: true,
          read: false
        },
      ]);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      delivered: false,
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simular entrega
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, delivered: true } : msg
      ));
    }, 500);
  };

  // Vista de conversación individual
  if (selectedChat) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        {/* Header del chat */}

        <div className="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="w-full flex items-center gap-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 -ml-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-500" />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl">
                {selectedChat.avatar}
              </div>
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedChat.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedChat.online ? 'Activo ahora' : 'Offline'}
              </p>
            </div>

            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
       
        {/* Mensajes */}
        <div className=" flex flex-col h-[80%] p-4 space-y-1 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`
                    px-4 py-2 rounded-2xl
                    ${message.sender === 'me'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
                    }
                  `}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-gray-400">
                    {message.time}
                  </span>
                  {message.sender === 'me' && (
                    <span className="text-[10px]">
                      {message.read ? '✓✓' : message.delivered ? '✓' : '○'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
          
        {/* Input de mensaje */}


        <div className=" bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Plus className="w-6 h-6" />
            </button>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 flex items-center px-4 py-2">
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mr-2">
                <Camera className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Mensaje"
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />

              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-2">
                <Image className="w-5 h-5" />
              </button>
            </div>

            {messageInput.trim() ? (
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
        </div>


    );
  }

  // Vista de lista de conversaciones
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <MobileNav 
        title="Mensajes"
        onBack={onBack}
        showCancel={false}
        rightButton={
          <button className="text-blue-500 font-medium">
            Editar
          </button>
        }
      />

      {/* Search bar */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center">
          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 h-5 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedChat(conv)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-900"
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
                {conv.avatar}
              </div>
              {conv.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
              )}
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {conv.name}
                </h3>
                <span className="text-xs text-gray-500 ml-2">
                  {conv.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {conv.lastMessage}
                </p>
                {conv.unread > 0 && (
                  <div className="ml-2 flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {conv.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Botón flotante para nuevo mensaje */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default MessagesScreen;