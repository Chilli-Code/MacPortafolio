import { useState, useEffect } from 'react';
import { X, Send } from '#assets/icons';

const AdminTaskForm = ({ onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    type: 'frontend',
    difficulty: 'medium',
    xp: 250,
    reward: 150,
    deadline: '',
    tags: ''
  });

  // ⭐ Cargar datos iniciales si está editando
  useEffect(() => {
    if (initialData) {
      console.log('📝 Cargando datos para editar:', initialData);
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        detailedDescription: initialData.detailedDescription || '',
        type: initialData.type || 'frontend',
        difficulty: initialData.difficulty || 'medium',
        xp: initialData.xp || 250,
        reward: initialData.reward || 150,
        deadline: initialData.deadline || '',
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      xp: parseInt(formData.xp),
      reward: parseInt(formData.reward)
    };

    onSubmit(taskData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isEditing ? '✏️ Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ⭐ Título */}
          <Input 
            label="Título" 
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            required 
            placeholder="Ej: Crear componente Login"
          />
          
          {/* ⭐ Descripción corta */}
          <Input 
            label="Descripción corta" 
            value={formData.description} 
            onChange={(e) => handleChange('description', e.target.value)} 
            required 
            placeholder="Ej: Desarrollar un formulario de login con validación"
          />
          
          {/* ⭐ Descripción detallada */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción detallada</label>
            <textarea
              value={formData.detailedDescription}
              onChange={(e) => handleChange('detailedDescription', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="# Requisitos:&#10;- HTML semántico&#10;- CSS responsive&#10;- Validación con JavaScript&#10;&#10;# Criterios:&#10;- Mobile first&#10;- Accesibilidad WCAG"
              required
            />
          </div>

          {/* ⭐ Tipo y Dificultad */}
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Tipo" 
              value={formData.type} 
              onChange={(e) => handleChange('type', e.target.value)} 
              options={['frontend', 'backend', 'fullstack', 'designer', 'devops']} 
            />
            
            <Select 
              label="Dificultad" 
              value={formData.difficulty} 
              onChange={(e) => handleChange('difficulty', e.target.value)} 
              options={['easy', 'medium', 'hard']} 
            />
          </div>

          {/* ⭐ XP y Pago */}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="XP" 
              type="number" 
              value={formData.xp} 
              onChange={(e) => handleChange('xp', e.target.value)} 
              min="0"
              max="1000"
            />
            
            <Input 
              label="Pago ($)" 
              type="number" 
              value={formData.reward} 
              onChange={(e) => handleChange('reward', e.target.value)} 
              min="0"
              max="1000"
            />
          </div>

          {/* ⭐ Deadline */}
          <Input 
            label="Deadline" 
            type="date" 
            value={formData.deadline} 
            onChange={(e) => handleChange('deadline', e.target.value)} 
            required 
          />
          
          {/* ⭐ Tags */}
          <Input 
            label="Tags (separados por coma)" 
            value={formData.tags} 
            onChange={(e) => handleChange('tags', e.target.value)} 
            placeholder="React, Node.js, API, MongoDB, Tailwind"
          />

          {/* ⭐ Botón de submit */}
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isEditing ? 'Actualizar Tarea' : 'Publicar Tarea'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ⭐ Componente Input
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input 
      {...props} 
      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500" 
    />
  </div>
);

// ⭐ Componente Select
const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <select 
      {...props} 
      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white capitalize"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default AdminTaskForm;