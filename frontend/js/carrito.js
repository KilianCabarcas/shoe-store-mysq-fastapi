// Mostrar carrito
function cargarCarrito() {
    fetch(API + "/carrito")
        .then(r => r.json())
        .then(data => {
            let html = "";
            let total = 0;
            
            if (data.length === 0) {
                html = `
                    <div class="text-center py-8 text-gray-500">
                        <p>Tu carrito está vacío</p>
                        <p class="text-sm mt-2">Agrega algunos productos para comenzar</p>
                    </div>
                `;
            } else {
                data.forEach(item => {
                    const subtotal = item.precio_unitario * item.cantidad;
                    total += subtotal;
                    
                    html += `
                        <div class="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                            <div class="flex items-center space-x-4">
                                ${item.foto ? 
                                    `<img src="${item.foto}" alt="${item.nombre}" class="w-16 h-16 object-cover rounded-lg shadow-sm">` : 
                                    `<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span class="text-gray-400 text-xs">IMG</span>
                                    </div>`
                                }
                                <div>
                                    <h4 class="font-medium text-gray-900">${item.nombre}</h4>
                                    <p class="text-sm text-gray-600">$${item.precio_unitario} c/u</p>
                                    ${item.aplica_iva ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Con IVA</span>' : '<span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Sin IVA</span>'}
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="flex items-center space-x-2">
                                    <button onclick="editarCantidadCarrito(${item.id}, ${item.cantidad})" 
                                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Cantidad: ${item.cantidad}
                                    </button>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold text-gray-900">$${subtotal.toFixed(2)}</p>
                                    <button onclick="borrarItemCarrito(${item.id})" 
                                            class="text-red-600 hover:text-red-800 text-sm font-medium mt-1">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                // Total del carrito
                html += `
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <div class="flex justify-between items-center text-lg font-semibold text-gray-900">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">IVA incluido cuando aplique</p>
                    </div>
                `;
            }
            
            document.getElementById("carrito").innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar carrito:', error);
            document.getElementById("carrito").innerHTML = `
                <div class="text-center py-8 text-red-500">
                    <p>Error al cargar el carrito</p>
                    <button onclick="cargarCarrito()" class="text-blue-600 hover:text-blue-800 mt-2">Reintentar</button>
                </div>
            `;
        });
}

// Editar cantidad en carrito
window.editarCantidadCarrito = function(id, cantidadActual) {
    const nuevaCantidad = prompt("¿Cuál es la nueva cantidad?", cantidadActual);
    if (!nuevaCantidad || nuevaCantidad <= 0 || isNaN(nuevaCantidad)) return;
    
    fetch(API + "/carrito/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cantidad: parseInt(nuevaCantidad)})
    })
    .then(r => r.json())
    .then(() => {
        showAlert("Cantidad actualizada", "success");
        cargarCarrito();
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert("Error al actualizar cantidad", "error");
    });
}

// Borrar item del carrito
window.borrarItemCarrito = function(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto del carrito?")) return;
    
    fetch(API + "/carrito/" + id, {method: "DELETE"})
        .then(r => r.json())
        .then(() => {
            showAlert("Producto eliminado del carrito", "success");
            cargarCarrito();
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert("Error al eliminar producto", "error");
        });
}

// Agregar al carrito desde formulario
document.getElementById("form-carrito").onsubmit = function(e) {
    e.preventDefault();
    const productoId = parseInt(document.getElementById("producto_id").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);
    
    fetch(API + "/carrito", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            producto_id: productoId,
            cantidad: cantidad
        })
    })
    .then(r => r.json())
    .then(() => {
        showAlert("Producto agregado al carrito", "success");
        document.getElementById("form-carrito").reset();
        document.getElementById("cantidad").value = 1;
        cargarCarrito();
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert("Error al agregar producto al carrito", "error");
    });
}

// Realizar pedido
function realizarPedido() {
    if (!confirm("¿Confirmas que quieres realizar este pedido?")) return;
    
    fetch(API + "/realizar-pedido", {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showAlert(`${data.mensaje}. Total: $${data.total}`, "success");
            cargarCarrito(); // Recargar carrito (debería estar vacío)
            cargarPedidos(); // Recargar pedidos si estamos en esa sección
        } else {
            showAlert("Error al realizar pedido", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert("Error al realizar pedido", "error");
    });
}