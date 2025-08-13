from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.producto import Producto

router = APIRouter()

@router.post("/productos")
def crear_producto(producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO productos (nombre, descripcion, foto, talla, peso, precio_unitario, iva, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (producto.nombre, producto.descripcion, producto.foto, producto.talla, producto.peso, producto.precio_unitario, producto.iva, producto.categoria)
    )
    conn.commit()
    producto_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"mensaje": "Producto creado", "id": producto_id}

@router.get("/productos")
def listar_productos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return productos

@router.get("/productos/categoria/{categoria}")
def productos_por_categoria(categoria: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos WHERE categoria=%s", (categoria,))
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return productos

@router.put("/productos/{id}")
def editar_producto(id: int, producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE productos SET nombre=%s, descripcion=%s, foto=%s, talla=%s, peso=%s, precio_unitario=%s, iva=%s, categoria=%s WHERE id=%s",
        (producto.nombre, producto.descripcion, producto.foto, producto.talla, producto.peso, producto.precio_unitario, producto.iva, producto.categoria, id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto editado"}

@router.delete("/productos/{id}")
def eliminar_producto(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM productos WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto eliminado"}