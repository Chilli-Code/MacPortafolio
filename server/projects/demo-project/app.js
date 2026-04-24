function showMessage() {
    const messages = [
        '✅ Excelente! Funciona correctamente',
        '⚡ Editor Online MacPortafolio',
        '🎨 Edita cualquier parte del codigo',
        '🚀 Los cambios se guardan automaticamente',
        '✨ Cualquier usuario puede usar esto!'
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    document.getElementById('message').textContent = messages[randomIndex];
}

console.log('🚀 Proyecto Demo cargado correctamente');
console.log('✏️ Edita este archivo desde el editor onlineeeeeee');