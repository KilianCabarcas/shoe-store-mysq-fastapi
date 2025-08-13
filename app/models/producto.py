from pydantic import BaseModel


class Producto(BaseModel):
    id: int | None = None
    nombre: str
    descripcion: str | None = None
    foto: str | None = None
    talla: str | None = None
    peso: float | None = None
    precio_unitario: float
    iva: float
    categoria: str