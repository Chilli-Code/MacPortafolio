import {Search} from "#assets/icons"









const TableUsers = () => {
  return (
    <div>
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Usuarios Recientes</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
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
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Estado</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Último acceso</th>
            </tr>
          </thead>
          <tbody>
            {[
              { 
                name: 'Jorge Martínez', 
                email: 'jorge@example.com', 
                status: 'online', 
                lastSeen: 'Ahora',
                avatarColor: 'from-blue-500 to-purple-600'
              },
              { 
                name: 'María García', 
                email: 'maria@example.com', 
                status: 'offline', 
                lastSeen: '5 min',
                avatarColor: 'from-pink-500 to-rose-600'
              },
              { 
                name: 'Carlos López', 
                email: 'carlos@example.com', 
                status: 'online', 
                lastSeen: 'Ahora',
                avatarColor: 'from-green-500 to-emerald-600'
              },
              { 
                name: 'Ana Torres', 
                email: 'ana@example.com', 
                status: 'away', 
                lastSeen: '15 min',
                avatarColor: 'from-amber-500 to-orange-600'
              },
            ].map((user, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${user.avatarColor} rounded-full flex items-center justify-center text-sm font-bold`}>
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'online' ? 'bg-green-500/20 text-green-400' :
                    user.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.status === 'online' ? 'En línea' : 
                     user.status === 'away' ? 'Ausente' : 'Desconectado'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">{user.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Puedes agregar más secciones aquí si necesitas */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">Fronted</h3>
          <p className="text-3xl font-bold">42</p>
          <p className="text-sm text-gray-400 mt-1">Registrados</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">Backend</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-gray-400 mt-1">En línea</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="font-bold mb-2">UIX</h3>
          <p className="text-3xl font-bold">18</p>
          <p className="text-sm text-gray-400 mt-1">Disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default TableUsers;
