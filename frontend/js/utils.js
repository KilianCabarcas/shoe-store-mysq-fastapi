// Función para mostrar alertas
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
 
    switch(type) {
        case 'success':
            alert.className += ' bg-green-500 text-white';
            break;
        case 'error':
            alert.className += ' bg-red-500 text-white';
            break;
        case 'warning':
            alert.className += ' bg-yellow-500 text-white';
            break;
        default:
            alert.className += ' bg-blue-500 text-white';
    }
    
    alert.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Animación de entrada
    setTimeout(() => {
        alert.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        alert.classList.add('translate-x-full');
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 300);
    }, 3000);
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}