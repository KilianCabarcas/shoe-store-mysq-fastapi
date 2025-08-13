from fastapi import APIRouter, HTTPException
from app.db.database import get_connection
from app.models.pedido import Pedido

router = APIRouter()

@router.post("/pedidos")
def crear_pedido(pedido: Pedido):
    try:
        usuario_id = 1  # Usuario único
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO pedidos (usuario_id, total) VALUES (%s, %s)",
            (usuario_id, pedido.total)
        )
        pedido_id = cursor.lastrowid
        for detalle in pedido.detalles:
            cursor.execute(
                "INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, iva) VALUES (%s, %s, %s, %s, %s)",
                (pedido_id, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, detalle.iva)
            )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Pedido creado exitosamente", "pedido_id": pedido_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/realizar-pedido")
def realizar_pedido():
    try:
        usuario_id = 1  # Usuario único
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Obtener productos del carrito
        cursor.execute(
            "SELECT producto_id, cantidad FROM carrito WHERE usuario_id = %s",
            (usuario_id,)
        )
        items = cursor.fetchall()
        if not items:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=400, detail="El carrito está vacío")

        # 2. Obtener detalles de productos y calcular total
        total = 0
        detalles = []
        for item in items:
            cursor.execute(
                "SELECT precio_unitario, iva FROM productos WHERE id = %s",
                (item['producto_id'],)
            )
            prod = cursor.fetchone()
            if not prod:
                continue
            subtotal = (prod['precio_unitario'] + prod['iva']) * item['cantidad']
            total += subtotal
            detalles.append({
                "producto_id": item['producto_id'],
                "cantidad": item['cantidad'],
                "precio_unitario": prod['precio_unitario'],
                "iva": prod['iva']
            })

        # 3. Crear pedido
        cursor.execute(
            "INSERT INTO pedidos (usuario_id, total) VALUES (%s, %s)",
            (usuario_id, total)
        )
        pedido_id = cursor.lastrowid

        # 4. Crear detalles del pedido
        for d in detalles:
            cursor.execute(
                "INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, iva) VALUES (%s, %s, %s, %s, %s)",
                (pedido_id, d['producto_id'], d['cantidad'], d['precio_unitario'], d['iva'])
            )

        # 5. Vaciar el carrito
        cursor.execute("DELETE FROM carrito WHERE usuario_id = %s", (usuario_id,))

        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Pedido realizado exitosamente", "pedido_id": pedido_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pedidos")
def listar_pedidos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pedidos")
    pedidos = cursor.fetchall()
    cursor.close()
    conn.close()
    return pedidos