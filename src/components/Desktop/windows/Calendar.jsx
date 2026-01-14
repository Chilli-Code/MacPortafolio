// src/components/Calendar/Calendar.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle, CalendarIcon, Clock } from '#assets/icons';
import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";

// Tipos de eventos con sus colores
const EVENT_TYPES = {
    task: { color: 'bg-red-500', label: 'Tarea' },
    launch: { color: 'bg-blue-500', label: 'Lanzamiento' },
    meeting: { color: 'bg-purple-500', label: 'Reunión' },
    break: { color: 'bg-green-500', label: 'Descanso' },
    hiring: { color: 'bg-orange-500', label: 'Contratación' }
};

const Calendar = ({ isMaximized, setIsMaximized }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    // Datos de ejemplo - reemplazar con datos reales
    const events = {
        '2026-01-15': [
            { type: 'task', title: 'Entrega Proyecto React', time: '14:00' },
            { type: 'meeting', title: 'Reunión de equipo', time: '16:00' }
        ],
        '2026-01-20': [
            { type: 'launch', title: 'Lanzamiento App v2.0', time: '09:00' }
        ],
        '2026-01-22': [
            { type: 'break', title: 'Día de descanso', time: 'Todo el día' }
        ],
        '2026-01-25': [
            { type: 'hiring', title: 'Entrevista candidatos', time: '11:00' },
            { type: 'task', title: 'Revisión de código', time: '15:00' }
        ]
    };

    // Obtener días del mes
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        return (
            day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear()
        );
    };

    const getDateKey = (day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const hasEvents = (day) => {
        return events[getDateKey(day)]?.length > 0;
    };

    const getEventsForSelectedDate = () => {
        const dateKey = getDateKey(selectedDate.getDate());
        return events[dateKey] || [];
    };

    return (
        <>
            <div id="window-header" className="bg-gray-50 rounded-t-lg px-3 py-1">
                {/* Header con controles de ventana */}
                <WindowControls target="calendar" onMaximize={handleMaximize} />


                <h2 className="flex items-center gap-2 justify-center w-full">
                    <CalendarIcon className="icon" />
                    Calendario
                </h2>

                <div className="flex-shrink-0 rounded-full p-1 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl bg-white/80 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                    </div>
                    {/* Navegación de mes */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={previousMonth}
                            className="w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* MES + AÑO */}
                        <div className="flex flex-col items-center min-w-[140px] leading-tight">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {monthNames[currentDate.getMonth()]}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {currentDate.getFullYear()}
                            </span>
                        </div>

                        <button
                            onClick={nextMonth}
                            className="w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                </div>
            </div>

            <div className='bg-white dark:bg-gray-900 flex h-full overflow-hidden'>
                <div className='w-50 sidebar mb-10 bg-gray-50 dark:bg-gray-800 p-2 overflow-y-auto border-r border-gray-200 dark:border-gray-700'>
                    <div className="p-5">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                {selectedDate.toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getEventsForSelectedDate().length} evento{getEventsForSelectedDate().length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Lista de eventos */}
                        <div className="space-y-2">
                            {getEventsForSelectedDate().length > 0 ? (
                                getEventsForSelectedDate().map((event, index) => (
                                    <div

                                        title={`${EVENT_TYPES[event.type].label}\n ${event.title} `}
                                        key={index}
                                        className="p-1 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-1 h-full ${EVENT_TYPES[event.type].color} rounded-full flex-shrink-0 mt-1`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${EVENT_TYPES[event.type].color} bg-opacity-10 text-gray-700 dark:text-gray-300`}>
                                                        {EVENT_TYPES[event.type].label}
                                                    </span>
                                                    <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {event.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white  break-words">
                                                    {event.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Circle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No hay eventos para este día
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Leyenda de tipos de eventos */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Tipos de eventos
                            </h4>
                            <div className="space-y-2">
                                {Object.entries(EVENT_TYPES).map(([key, { color, label }]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${color}`} />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Contenido principal */}
                <div className="flex-1 flex p-5 pr-1 space-y-5 bgProf h-full overflow-auto">
                    {/* Vista de calendario */}
                    <div className="flex-1 p-6 px-2 overflow-auto mb-10">

                        {/* Nombres de días */}
                        <div className="grid grid-cols-7 mb-2">
                            {dayNames.map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Semanas */}
                        <div className="flex flex-col gap-1">
                            {Array.from({ length: Math.ceil((daysInMonth + startingDayOfWeek) / 7) }).map(
                                (_, weekIndex) => (
                                    <div
                                        key={weekIndex}
                                        className="grid grid-cols-7 gap-1 min-h-[120px]"
                                    >
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            const dayNumber =
                                                weekIndex * 7 + dayIndex - startingDayOfWeek + 1;

                                            const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                                            const selected = isValidDay && isSelected(dayNumber);
                                            const today = isValidDay && isToday(dayNumber);
                                            const dayEvents = isValidDay
                                                ? events[getDateKey(dayNumber)] || []
                                                : [];

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    onClick={() =>
                                                        isValidDay &&
                                                        setSelectedDate(
                                                            new Date(
                                                                currentDate.getFullYear(),
                                                                currentDate.getMonth(),
                                                                dayNumber
                                                            )
                                                        )
                                                    }
   className={`
  relative rounded-lg p-2 transition-colors group cursor-pointer
  min-h-[100px] flex flex-col
  ${selected
      ? 'bg-blue-500 text-white shadow-lg border border-blue-500'
      : today
          ? 'border border-blue-200 dark:border-blue-100 bg-gray-300 dark:bg-gray-700 dark:text-blue-500 text-blue-600 font-semibold'
          : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
  }
  ${!isValidDay && 'opacity-40 pointer-events-none'}
`}
                                                >
                                                    {/* Número */}
                                                    {isValidDay && (
                                                        <span className="text-sm font-medium mb-1">
                                                            {dayNumber}
                                                        </span>
                                                    )}

                                                    {/* Eventos */}
                                                    <div className="flex flex-col gap-1 mt-auto">
                                                        {dayEvents.slice(0, 3).map((event, i) => (
                                                            <div
                                                            title={`${EVENT_TYPES[event.type].label}\n ${event.title} `}
                                                                key={i}
                                                                className={`
                        text-[10px] px-2 py-1 rounded truncate font-medium
                        ${EVENT_TYPES[event.type].color}
                        bg-opacity-20
                      `}
                                                            >
                                                                {event.title}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Botón + */}
                                                    {isValidDay && (
                                                        <button
                                                            className="
                      absolute top-1 right-1 opacity-0 group-hover:opacity-100
                      transition-opacity w-5 h-5 rounded-full
                      hover:bg-gray-300 dark:hover:bg-gray-700
                      flex items-center justify-center text-xs
                    "
                                                        >
                                                            +
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}
                        </div>
                    </div>



                </div>
            </div>
        </>
    );
};



const canlendarWindow = WindowWrapper(Calendar, "calendar");
export default canlendarWindow;