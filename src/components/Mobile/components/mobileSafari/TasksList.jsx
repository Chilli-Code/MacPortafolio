import { useState } from 'react';
import {CalendarIcon, DollarSign, Zap, Clock, CheckCircle, XCircle, ChevronRight } from "#assets/icons";
import Marquee from 'react-fast-marquee';
import { getTechConfig } from '#assets/techIcons/techConfig.jsx';

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const TasksList = ({ activeTab, searchQuery, tasksByStatus, onTaskDetail }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const currentTasks = tasksByStatus[activeTab] || [];
  const filteredTasks = currentTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 mb-20">
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="text-gray-300 dark:text-gray-600 mb-4">
            {activeTab === 'available' && <CalendarIcon className="w-16 h-16" />}
            {activeTab === 'in_progress' && <Clock className="w-16 h-16" />}
            {activeTab === 'completed' && <CheckCircle className="w-16 h-16" />}
            {activeTab === 'rejected' && <XCircle className="w-16 h-16" />}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {searchQuery ? 'No se encontraron tareas' : 'No hay tareas aquí'}
          </p>
          {activeTab === 'available' && !searchQuery && (
            <p className="text-sm text-blue-500">
              💡 Abre Terminal y ejecuta "tasks fetch"
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const shouldMarquee = task.tags && task.tags.length > 4;
            const forceMarquee = isExpanded && shouldMarquee;
            
            return (
              <div
                key={task.id}
                className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden"
              >
                {/* Card clickeable para expandir */}
                <div
                  onClick={() => toggleExpand(task.id)}
                  className="p-4 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {/* Title & Difficulty */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left flex-1">
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[task.difficulty]}`}>
                      {task.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-left mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Tags Section */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="my-4 overflow-hidden">
                      {forceMarquee ? (
                        // Marquee activado por click
                        <div className="android-marquee-fix">
                          <Marquee 
                            speed={40}
                            gradient={false}
                            pauseOnHover={true}
                            pauseOnClick={true}
                            className="flex items-center"
                            style={{ 
                              overflow: 'visible',
                              willChange: 'transform'
                            }}
                          >
                            {task.tags.map((tag, i) => {
                              const config = getTechConfig(tag);
                              return (
                                <span 
                                  key={i} 
                                  className={`px-3 py-1.5 mx-1 text-xs font-medium rounded-full flex items-center gap-1.5 flex-shrink-0 ${config?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                                  style={{ 
                                    display: 'inline-flex',
                                    backfaceVisibility: 'hidden'
                                  }}
                                >
                                  {config?.icon && <span className="flex-shrink-0">{config.icon}</span>}
                                  <span className="flex-shrink-0">{tag}</span>
                                </span>
                              );
                            })}
                          </Marquee>
                        </div>
                      ) : (
                        // Sin Marquee o tags normales
                        <div className="flex gap-1 overflow-hidden overflow-x-scroll w-full barraS">
                          {task.tags.slice(0, 4).map((tag, i) => {
                            const config = getTechConfig(tag);
                            return (
                              <span 
                                key={i} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 flex-shrink-0 ${config?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                              >
                                {config?.icon && <span className="flex-shrink-0">{config.icon}</span>}
                                <span className="flex-shrink-0">{tag}</span>
                              </span>
                            );
                          })}
                          {shouldMarquee && !isExpanded && (
                            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              +{task.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{task.xp} XP</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">${task.reward}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{task.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Botón Ver Detalles - Aparece cuando está expandido */}
                {isExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskDetail?.(task);
                    }}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    Ver Detalles Completos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksList;