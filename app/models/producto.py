from pydantic import BaseModel
from typing import Optional

class Producto(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_unitario: float
    categoria: str
    foto: Optional[str] = None
    talla: Optional[str] = None
    aplica_iva: bool = True 