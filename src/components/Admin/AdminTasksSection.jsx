import { Plus, ArrowUpDown, ArrowUp, ArrowDown, DollarSign, Zap, Calendar } from '#assets/icons';
import AdminTaskCard from './AdminTaskCard';
import { useState } from 'react';

const AdminTasksSection = ({ 
  allTasks, 
  onSelectTask, 
  onNewTask, 
  onRefresh,
  onEditTask,
  onDeleteTask,
  onApproveTask,
  onRejectTask
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');

  const filters = [
    { id: 'all', label: 'Todas', count: allTasks.length },
    { id: 'available', label: 'Disponibles', count: allTasks.filter(t => t.status === 'available').length },
    { id: 'in_progress', label: 'En Progreso', count: allTasks.filter(t => t.status === 'in_progress').length },
    { id: 'pending_review', label: 'En Revisión', count: allTasks.filter(t => t.status === 'pending_review').length },
    { id: 'completed', label: 'Completadas', count: allTasks.filter(t => t.status === 'completed').length }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Más Recientes', icon: Calendar },
    { id: 'oldest', label: 'Más Antiguas', icon: Calendar },
    { id: 'xp_high', label: 'Mayor XP', icon: Zap },
    { id: 'xp_low', label: 'Menor XP', icon: Zap },
    { id: 'pay_high', label: 'Mayor Pago', icon: DollarSign },
    { id: 'pay_low', label: 'Menor Pago', icon: DollarSign }
  ];

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      const rewardA = a.rewards?.baseReward || a.baseReward || a.reward || 0;
      const rewardB = b.rewards?.baseReward || b.baseReward || b.reward || 0;
      const xpA = a.rewards?.xp || a.xp || 0;
      const xpB = b.rewards?.xp || b.xp || 0;
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      let comparison = 0;
      switch (sortBy) {
        case 'newest':
          comparison = dateB - dateA;
          break;
        case 'oldest':
          comparison = dateA - dateB;
          break;
        case 'xp_high':
          comparison = xpB - xpA;
          break;
        case 'xp_low':
          comparison = xpA - xpB;
          break;
        case 'pay_high':
          comparison = rewardB - rewardA;
          break;
        case 'pay_low':
          comparison = rewardA - rewardB;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
  };

  const filteredTasks = activeFilter === 'all' 
    ? sortTasks(allTasks) 
    : sortTasks(allTasks.filter(t => t.status === activeFilter));

  const handleSortChange = (sortId) => {
    if (sortBy === sortId) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(sortId);
      setSortOrder('desc');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Tareas (Admin)</h2>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ↻ Refrescar
          </button>
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {filters.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeFilter === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300'
            }`}
          >
            <span>{label}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeFilter === id
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros de ordenamiento */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-gray-400 text-sm flex items-center">
          <ArrowUpDown className="w-4 h-4 mr-1" />
          Ordenar:
        </span>
        {sortOptions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSortChange(id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              sortBy === id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800/50 hover:bg-gray-800 text-gray-400'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
            {sortBy === id && (
              sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Información de depuración */}
        <div className="mb-4 p-3 bg-gray-800/30 rounded-lg text-sm">
          <p className="text-gray-300">
            Mostrando <strong>{filteredTasks.length}</strong> de <strong>{allTasks.length}</strong> tareas totales
          </p>
          <div className="flex gap-4 mt-2 text-gray-400 text-xs">
            {filters.filter(f => f.id !== 'all').map(f => (
              <span key={f.id}>
                {f.label}: {f.count}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Mostrar mensaje si no hay tareas con este filtro */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {activeFilter === 'all' 
              ? 'No hay tareas para mostrar'
              : `No hay tareas ${filters.find(f => f.id === activeFilter)?.label.toLowerCase()}`
            }
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Filtro activo: <code>{activeFilter}</code></p>
          </div>
          {(activeFilter === 'completed') && (
            <p className="mt-2 text-gray-500">
              Las tareas aparecerán aquí cuando un administrador las apruebe
            </p>
          )}
          <button 
            onClick={onNewTask}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
          >
            Crear Nueva Tarea
          </button>
        </div>
      ) : (
        // Mostrar tareas filtradas
        <div className="grid mb-20 grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <AdminTaskCard 
              key={task.id} 
              task={task} 
              onSelect={onSelectTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onApprove={onApproveTask}
              onReject={onRejectTask}
              isAdmin={true}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AdminTasksSection;