// Mostrar pedidos
function cargarPedidos() {
    fetch(API + "/pedidos")
        .then(r => r.json())
        .then(data => {
            let html = "";
            
            if (data.length === 0) {
                html = `
                    <div class="text-center py-12 text-gray-500">
                        <div class="text-6xl mb-4">🛒</div>
                        <h3 class="text-lg font-medium mb-2">No tienes pedidos aún</h3>
                        <p class="text-sm">Cuando realices tu primer pedido aparecerá aquí</p>
                    </div>
                `;
            } else {
                data.forEach(pedido => {
                    const fecha = new Date(pedido.fecha).toLocaleString('es-ES');
                    
                    html += `
                        <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
                            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="text-lg font-semibold text-gray-900">Pedido #${pedido.id}</h3>
                                        <p class="text-sm text-gray-600">${fecha}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-lg font-bold text-green-600">$${pedido.total}</p>
                                        <p class="text-xs text-gray-500">${pedido.total_items} producto(s)</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="px-6 py-4">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <span class="text-sm text-gray-600">Subtotal:</span>
                                        <span class="font-medium ml-2">$${pedido.subtotal}</span>
                                    </div>
                                    <div>
                                        <span class="text-sm text-gray-600">IVA:</span>
                                        <span class="font-medium ml-2">$${pedido.iva_total}</span>
                                    </div>
                                    <div>
                                        <span class="text-sm text-gray-600">Total:</span>
                                        <span class="font-bold text-green-600 ml-2">$${pedido.total}</span>
                                    </div>
                                </div>
                                
                                <div class="space-y-3">
                                    <h4 class="font-medium text-gray-900 border-b pb-2">Productos:</h4>
                    `;
                    
                    if (pedido.items && pedido.items.length > 0) {
                        pedido.items.forEach(item => {
                            html += `
                                <div class="flex items-center justify-between py-2">
                                    <div class="flex items-center space-x-3">
                                        ${item.foto ? 
                                            `<img src="${item.foto}" alt="${item.nombre}" class="w-10 h-10 object-cover rounded-lg shadow-sm">` : 
                                            `<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span class="text-gray-400 text-xs">IMG</span>
                                            </div>`
                                        }
                                        <div>
                                            <p class="font-medium text-gray-900">${item.nombre}</p>
                                            <p class="text-sm text-gray-600">$${item.precio_unitario} x ${item.cantidad}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-gray-900">$${item.subtotal}</p>
                                    </div>
                                </div>
                            `;
                        });
                    } else {
                        html += `<p class="text-gray-500 text-sm">No se pudieron cargar los detalles</p>`;
                    }
                    
                    html += `
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            
            document.getElementById("pedidos").innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar pedidos:', error);
            document.getElementById("pedidos").innerHTML = `
                <div class="text-center py-12 text-red-500">
                    <h3 class="text-lg font-medium mb-2">Error al cargar pedidos</h3>
                    <button onclick="cargarPedidos()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4">
                        Reintentar
                    </button>
                </div>
            `;
        });
}