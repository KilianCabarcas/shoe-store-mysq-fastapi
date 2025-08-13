from pydantic import BaseModel

class Categoria(BaseModel):
    nombre: str
    descripcion: str | None = None