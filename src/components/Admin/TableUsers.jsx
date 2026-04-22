import { Search, Trash2, Edit } from "#assets/icons";
import { useState, useEffect } from 'react';

const TableUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estas seguro de eliminar este usuario?')) return;
    
    try {
      await fetch(`http://localhost:3001/api/users/${userId}`, { method: 'DELETE' });
      loadUsers();
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAvatarColor = (username) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-green-500 to-emerald-600',
      'from-amber-500 to-orange-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-indigo-600'
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div>
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Usuarios Registrados</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Usuario</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Rol</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Nivel</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Creado</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarColor(user.username)} rounded-full flex items-center justify-center text-sm font-bold`}>
                        {user.fullName?.charAt(0) || user.username.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium">{user.fullName || user.username}</span>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">Nivel {user.level}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">Total Usuarios</h3>
          <p className="text-3xl font-bold">{users.length}</p>
          <p className="text-sm text-gray-400 mt-1">Registrados en el sistema</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">Administradores</h3>
          <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-sm text-gray-400 mt-1">Con permisos totales</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">Usuarios</h3>
          <p className="text-3xl font-bold">{users.filter(u => u.role !== 'admin').length}</p>
          <p className="text-sm text-gray-400 mt-1">Usuarios normales</p>
        </div>
      </div>
    </div>
  );
};

export default TableUsers;