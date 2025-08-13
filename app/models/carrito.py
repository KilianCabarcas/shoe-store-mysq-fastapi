from pydantic import BaseModel

class Carrito(BaseModel):
    producto_id: int
    cantidad: int