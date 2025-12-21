const LoadingScreen = () =>{
    return(
      
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-white text-xl">Cargando sistema...</div>
        </div>
      </div>
    );
}

export default LoadingScreen;