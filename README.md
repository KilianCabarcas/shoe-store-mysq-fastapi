# Shoe-store 
Aplicación de e-commerce (zapatería) con FastAPI, MySQL y frontend HTML/JavaScript puro. Incluye gestión de productos, carrito de compras y pedidos.

## Requisitos Entorno
-Sistema Operativo: Windows 10/11 o similar
-Python: 3.8+ (recomendado 3.12)
-MySQL: 8.0+
-XAMPP: Para MySQL local (recomendado)

## Diseño UML
<img width="954" height="711" alt="{CF5D62DF-4AD8-45AE-BEC7-A4A5A4968C05}" src="https://github.com/user-attachments/assets/6c5c2b39-e716-43bd-a640-d3e60b39abcb" />


## Instalacion
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/ecommerce-zapateria.git
cd ecommerce-zapateria

# 2. Crear entorno virtual
python -m venv venv
# Windows
venv\Scripts\activate


# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar base de datos
 Abrir XAMPP → Iniciar MySQL → phpMyAdmin
 Ejecutar el contenido de: app/db/init.sql

# 5. Ejecutar aplicación
uvicorn app.main:app --reload

# 5 Instalar y abrir XAMPP Control Panel
Iniciar Apache y MySQL
Abrir phpMyAdmin (http://localhost/phpmyadmin)
Ir a SQL y ejecutar el contenido de init.sql

## CREDENCIALES DE PRUEBA
Usuario administrador:
Usuario: admin
Contraseña: admin123

## ENDPOINTS PRINCIPALES
Autenticación
POST /login

Productos
GET    /productos               # Listar todos
POST   /productos               # Crear nuevo
PUT    /productos/{id}          # Actualizar
DELETE /productos/{id}          # Eliminar
GET    /productos/categoria/{cat} # Por categoría

Carrito
GET    /carrito                 # Ver carrito
POST   /carrito                 # Agregar producto
PUT    /carrito/{item_id}       # Actualizar cantidad
DELETE /carrito/{item_id}       # Eliminar item
DELETE /carrito                 # Vaciar carrito

Pedidos
POST   /realizar-pedido         # Checkout
GET    /pedidos                 # Mis pedidos
GET    /pedidos/{id}            # Detalle de pedido

Categorías
GET    /categorias              # Listar todas
POST   /categorias              # Crear nueva
PUT    /categorias/{id}         # Actualizar
DELETE /categorias/{id}         # Eliminar


## FLUJO DE USO
Login
Usuario accede → Formulario login → Verificación → Dashboard
Gestión de Productos
Productos → Agregar/Editar → Especificar IVA → Guardar
Compra
Catálogo → Agregar al carrito → Editar cantidades → Realizar pedido → Confirmación

