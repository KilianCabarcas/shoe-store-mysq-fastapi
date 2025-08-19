let editandoCat = false;

// Cargar categorías
function cargarCategorias() {
    fetch(API + "/categorias")
        .then(r => r.json())
        .then(data => {
            let html = `<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">`;
            data.forEach(c => {
                html += `<tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${c.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${c.nombre}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.descripcion || ""}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onclick="editarCategoria(${c.id})" 
                                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                            ✏️ Editar
                        </button>
                        <button onclick="borrarCategoria(${c.id})" 
                                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 transition-colors">
                            🗑️ Borrar
                        </button>
                        <button onclick="verProductosCategoria('${c.nombre}')" 
                                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                            📦 Ver Productos
                        </button>
                    </td>
                </tr>`;
            });
            html += "</tbody></table></div>";
            document.getElementById("categorias").innerHTML = html;
            document.getElementById("productos-categoria").innerHTML = "";
        });
}

// Crear/editar categoría
document.getElementById("form-categoria").onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById("cat_id").value;
    const categoria = {
        nombre: document.getElementById("cat_nombre").value,
        descripcion: document.getElementById("cat_desc").value
    };
    
    if (editandoCat && id) {
        fetch(API + "/categorias/" + id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(categoria)
        })
        .then(r => r.json())
        .then(() => {
            showAlert("Categoría editada", "success");
            cargarCategorias();
            limpiarFormularioCategoria();
        });
    } else {
        fetch(API + "/categorias", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(categoria)
        })
        .then(r => r.json())
        .then(() => {
            showAlert("Categoría agregada", "success");
            cargarCategorias();
            limpiarFormularioCategoria();
        });
    }
};

// Editar categoría
window.editarCategoria = function(id) {
    fetch(API + "/categorias")
        .then(r => r.json())
        .then(data => {
            const cat = data.find(c => c.id === id);
            if (!cat) return;
            document.getElementById("cat_id").value = cat.id;
            document.getElementById("cat_nombre").value = cat.nombre;
            document.getElementById("cat_desc").value = cat.descripcion || "";
            document.getElementById("cat-form-title").innerHTML = '<span class="mr-2">✏️</span> Editar Categoría';
            document.getElementById("cancelar-cat-edicion").style.display = "inline-block";
            editandoCat = true;
        });
};

// Cancelar edición de categoría
document.getElementById("cancelar-cat-edicion").onclick = function() {
    limpiarFormularioCategoria();
};

function limpiarFormularioCategoria() {
    document.getElementById("cat-form-title").innerHTML = '<span class="mr-2">🏷️</span> Agregar Categoría';
    document.getElementById("form-categoria").reset();
    document.getElementById("cat_id").value = "";
    document.getElementById("cancelar-cat-edicion").style.display = "none";
    editandoCat = false;
}

// Borrar categoría
window.borrarCategoria = function(id) {
    if (!confirm("¿Seguro que quieres borrar esta categoría?")) return;
    fetch(API + "/categorias/" + id, {method: "DELETE"})
        .then(r => r.json())
        .then(() => {
            cargarCategorias();
            showAlert("Categoría borrada", "success");
        });
};

// Ver productos de una categoría por nombre
window.verProductosCategoria = function(nombre) {
    fetch(API + "/productos/categoria/" + encodeURIComponent(nombre))
        .then(r => r.json())
        .then(productos => {
            let html = `<div class="bg-white p-4 rounded-lg border">
                <h4 class="font-bold text-lg mb-4 flex items-center">
                    <span class="mr-2">📦</span> Productos en "${nombre}"
                </h4>`;
            if (productos.length === 0) {
                html += `<p class="text-gray-500 text-center py-4">No hay productos en esta categoría.</p>`;
            } else {
                html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
                productos.forEach(p => {
                    html += `<div class="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                        <h5 class="font-semibold text-gray-800">${p.nombre}</h5>
                        <p class="text-sm text-gray-600">ID: ${p.id}</p>
                        <p class="text-sm font-semibold text-green-600">$${p.precio_unitario}</p>
                    </div>`;
                });
                html += "</div>";
            }
            html += "</div>";
            document.getElementById("productos-categoria").innerHTML = html;
        });
};