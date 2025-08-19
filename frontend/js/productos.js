let editando = false;

// Mostrar productos en tabla
function cargarProductos() {
    fetch(API + "/productos")
        .then(r => r.json())
        .then(data => {
            let html = `<div class="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IVA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">`;
            data.forEach(p => {
                html += `<tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            ${p.foto ? `<img src="${p.foto}" alt="foto" class="h-10 w-10 rounded-lg object-cover mr-3 shadow-sm">` : '<div class="h-10 w-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center"><span class="text-gray-400 text-xs">IMG</span></div>'}
                            <div>
                                <div class="text-sm font-medium text-gray-900">${p.nombre}</div>
                                <div class="text-sm text-gray-500">${p.descripcion || ''}</div>
                                ${p.talla ? `<div class="text-xs text-gray-400">Talla: ${p.talla}</div>` : ''}
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            ${p.categoria}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">$${p.precio_unitario}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.aplica_iva ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${p.aplica_iva ? 'Sí' : 'No'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onclick="editarProducto(${p.id})" 
                                class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                            Editar
                        </button>
                        <button onclick="borrarProducto(${p.id})" 
                                class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors">
                            Borrar
                        </button>
                        <button onclick="agregarAlCarritoDesdeProducto(${p.id})" 
                                class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                            Agregar
                        </button>
                    </td>
                </tr>`;
            });
            html += "</tbody></table></div>";
            document.getElementById("productos").innerHTML = html;
        });
}

// Botón Agregar en productos
window.agregarAlCarritoDesdeProducto = function(idProducto) {
    const cantidad = prompt("¿Cuántos productos quieres agregar al carrito?", "1");
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) return;
    fetch(API + "/carrito", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            producto_id: idProducto,
            cantidad: parseInt(cantidad)
        })
    })
    .then(r => r.json())
    .then(() => {
        cargarCarrito();
        showAlert("Producto agregado al carrito", "success");
    });
}

// Borrar producto
function borrarProducto(id) {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    fetch(API + "/productos/" + id, {method: "DELETE"})
        .then(r => r.json())
        .then(() => {
            cargarProductos();
            showAlert("Producto borrado", "success");
        });
}

// Editar producto
window.editarProducto = function(id) {
    fetch(API + "/productos")
        .then(r => r.json())
        .then(data => {
            const prod = data.find(p => p.id === id);
            if (!prod) return;
            document.getElementById("prod_id").value = prod.id;
            document.getElementById("prod_nombre").value = prod.nombre;
            document.getElementById("prod_desc").value = prod.descripcion || "";
            document.getElementById("prod_foto").value = prod.foto || "";
            document.getElementById("prod_talla").value = prod.talla || "";
            document.getElementById("prod_precio").value = prod.precio_unitario;
            document.getElementById("prod_iva").value = prod.aplica_iva.toString();
            document.getElementById("prod_categoria").value = prod.categoria;
            document.getElementById("form-title").innerHTML = 'Editar Producto';
            document.getElementById("cancelar-edicion").style.display = "inline-block";
            editando = true;
        });
}

// Cancelar edición
document.getElementById("cancelar-edicion").onclick = function() {
    limpiarFormularioProducto();
};

// Guardar producto
document.getElementById("form-producto").onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById("prod_id").value;
    const producto = {
        nombre: document.getElementById("prod_nombre").value,
        descripcion: document.getElementById("prod_desc").value,
        foto: document.getElementById("prod_foto").value,
        talla: document.getElementById("prod_talla").value,
        precio_unitario: parseFloat(document.getElementById("prod_precio").value),
        aplica_iva: document.getElementById("prod_iva").value === "true",
        categoria: document.getElementById("prod_categoria").value
    };
    
    if (editando && id) {
        fetch(API + "/productos/" + id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(producto)
        })
        .then(r => r.json())
        .then(() => {
            showAlert("Producto editado", "success");
            cargarProductos();
            limpiarFormularioProducto();
        });
    } else {
        fetch(API + "/productos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(producto)
        })
        .then(r => r.json())
        .then(() => {
            showAlert("Producto agregado", "success");
            cargarProductos();
            limpiarFormularioProducto();
        });
    }
};

// Limpiar formulario
function limpiarFormularioProducto() {
    document.getElementById("form-title").innerHTML = 'Agregar Producto';
    document.getElementById("form-producto").reset();
    document.getElementById("prod_id").value = "";
    document.getElementById("cancelar-edicion").style.display = "none";
    editando = false;
}