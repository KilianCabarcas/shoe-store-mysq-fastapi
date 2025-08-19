from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.producto import Producto

router = APIRouter()

@router.get("/productos")
def get_productos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return productos

@router.post("/productos")
def crear_producto(producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO productos (nombre, descripcion, precio_unitario, categoria, foto, talla, aplica_iva) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (producto.nombre, producto.descripcion, producto.precio_unitario, producto.categoria, producto.foto, producto.talla, producto.aplica_iva)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto creado"}

@router.put("/productos/{producto_id}")
def actualizar_producto(producto_id: int, producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE productos SET nombre=%s, descripcion=%s, precio_unitario=%s, categoria=%s, foto=%s, talla=%s, aplica_iva=%s WHERE id=%s",
        (producto.nombre, producto.descripcion, producto.precio_unitario, producto.categoria, producto.foto, producto.talla, producto.aplica_iva, producto_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto actualizado"}

@router.delete("/productos/{producto_id}")
def borrar_producto(producto_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM productos WHERE id=%s", (producto_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto borrado"}

@router.get("/productos/categoria/{categoria}")
def get_productos_por_categoria(categoria: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos WHERE categoria = %s", (categoria,))
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return productos