import {TrendingUp, Users, Database ,AlertCircle, CheckCircle, Shield, Activity} from "#assets/icons";

const CardHome = () =>{
    return(
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Usuarios</p>
                    <p className="text-3xl font-bold text-blue-400">48</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% este mes</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Sesiones</p>
                    <p className="text-3xl font-bold text-green-400">3</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>8 activas ahora</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Almacenamiento</p>
                    <p className="text-3xl font-bold text-purple-400">42<span className="text-lg">GB</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>62% utilizado</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Estado</p>
                    <p className="text-3xl font-bold text-emerald-400">59%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Todo operativo</span>
                </div>
              </div>
        </div>
    )
}

export default CardHome;