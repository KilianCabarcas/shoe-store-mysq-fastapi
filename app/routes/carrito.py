from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.carrito import Carrito

router = APIRouter()

@router.post("/carrito")
def agregar_al_carrito(item: Carrito):
    try:
        usuario_id = 1  # Usuario único
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (%s, %s, %s)",
            (usuario_id, item.producto_id, item.cantidad)
        )
        conn.commit()
        nueva_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"mensaje": "Producto agregado al carrito", "id": nueva_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/carrito")
def ver_carrito():
    usuario_id = 1  # Usuario único
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT c.id, c.cantidad, p.nombre, p.precio_unitario, p.foto FROM carrito c JOIN productos p ON c.producto_id = p.id WHERE c.usuario_id = %s",
        (usuario_id,)
    )
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return items

@router.put("/carrito/{id}")
def editar_cantidad(id: int, cantidad: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE carrito SET cantidad=%s WHERE id=%s",
        (cantidad, id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Cantidad actualizada"}

@router.delete("/carrito/{id}")
def eliminar_item(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM carrito WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Producto eliminado del carrito"}