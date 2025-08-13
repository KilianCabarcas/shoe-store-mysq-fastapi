from pydantic import BaseModel
from typing import List

class PedidoDetalle(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float
    iva: float

class Pedido(BaseModel):
    total: float
    detalles: List[PedidoDetalle]