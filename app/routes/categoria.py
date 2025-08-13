from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.categoria import Categoria

router = APIRouter()

@router.post("/categorias")
def crear_categoria(categoria: Categoria):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO categorias (nombre, descripcion) VALUES (%s, %s)",
        (categoria.nombre, categoria.descripcion)
    )
    conn.commit()
    categoria_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"mensaje": "Categoría creada", "id": categoria_id}

@router.get("/categorias")
def listar_categorias():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categorias")
    categorias = cursor.fetchall()
    cursor.close()
    conn.close()
    return categorias

@router.put("/categorias/{id}")
def editar_categoria(id: int, categoria: Categoria):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE categorias SET nombre=%s, descripcion=%s WHERE id=%s",
        (categoria.nombre, categoria.descripcion, id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Categoría editada"}

@router.delete("/categorias/{id}")
def eliminar_categoria(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categorias WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"mensaje": "Categoría eliminada"}