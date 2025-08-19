const API = "http://127.0.0.1:8000";

// Mostrar login al inicio
document.getElementById("login").style.display = "flex";

// Navbar: mostrar secciones
function mostrarSeccion(seccion) {
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    document.getElementById('nav-' + seccion).classList.add('active');
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById('seccion-' + seccion).style.display = 'block';
    
    if (seccion === 'productos') cargarProductos();
    if (seccion === 'carrito') cargarCarrito();
    if (seccion === 'pedidos') cargarPedidos();
    if (seccion === 'categorias') cargarCategorias();
}

// Login
document.getElementById("form-login").onsubmit = function(e) {
    e.preventDefault();
    fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nombre_usuario: document.getElementById("usuario").value,
            contraseña: document.getElementById("contrasena").value
        })
    })
    .then(r => {
        if (r.ok) return r.json();
        throw new Error("Usuario o contraseña incorrectos");
    })
    .then(() => {
        document.getElementById("login").style.display = "none";
        document.getElementById("main").style.display = "block";
        mostrarSeccion('productos');
        cargarProductos();
        cargarCarrito();
        cargarPedidos();
        cargarCategorias();
    })
    .catch(err => {
        document.getElementById("login-error").innerText = err.message;
    });
};