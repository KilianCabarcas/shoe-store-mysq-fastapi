from pydantic import BaseModel

class Usuario(BaseModel):
    id: int | None = None
    nombre_usuario: str
    contraseña: str