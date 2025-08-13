from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.user import Usuario

router = APIRouter()

@router.post("/login")
def login(datos: Usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM usuarios WHERE nombre_usuario = %s AND contraseña = %s",
        (datos.nombre_usuario, datos.contraseña)
    )
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()
    if usuario:
        return {"mensaje": "Login exitoso", "usuario": usuario}
    else:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")