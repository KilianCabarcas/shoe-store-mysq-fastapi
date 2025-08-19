from fastapi import APIRouter, HTTPException
from app.db.database import get_connection

router = APIRouter()

# Usuario por defecto (ya que no hay sistema de sesiones)
USUARIO_DEFAULT = 1

@router.post("/realizar-pedido")
def realizar_pedido():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Obtener items del carrito con información del producto
        cursor.execute("""
            SELECT c.id, c.producto_id, c.cantidad, p.nombre, p.precio_unitario, p.aplica_iva
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = %s
        """, (USUARIO_DEFAULT,))
        items_carrito = cursor.fetchall()
        
        if not items_carrito:
            raise HTTPException(status_code=400, detail="El carrito está vacío")
        
        # Calcular totales
        subtotal = 0
        iva_total = 0
        IVA = 0.19 
        
        for item in items_carrito:
            item_subtotal = float(item['precio_unitario']) * item['cantidad']
            subtotal += item_subtotal
            
            if item['aplica_iva']:
                iva_total += item_subtotal * IVA
        
        total = subtotal + iva_total
        
        # Crear pedido
        cursor.execute(
            "INSERT INTO pedidos (usuario_id, subtotal, iva_total, total) VALUES (%s, %s, %s, %s)",
            (USUARIO_DEFAULT, subtotal, iva_total, total)
        )
        pedido_id = cursor.lastrowid
        
        # Crear detalle del pedido
        for item in items_carrito:
            item_subtotal = float(item['precio_unitario']) * item['cantidad']
            cursor.execute(
                "INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (pedido_id, item['producto_id'], item['cantidad'], float(item['precio_unitario']), item_subtotal)
            )
        
        # Vaciar carrito
        cursor.execute("DELETE FROM carrito WHERE usuario_id = %s", (USUARIO_DEFAULT,))
        
        conn.commit()
        
        return {
            "success": True,
            "mensaje": f"Pedido #{pedido_id} realizado exitosamente",
            "pedido_id": pedido_id,
            "subtotal": round(subtotal, 2),
            "iva": round(iva_total, 2),
            "total": round(total, 2)
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al realizar pedido: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.get("/pedidos")
def get_pedidos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Obtener pedidos 
        cursor.execute("""
            SELECT 
                p.id,
                p.fecha,
                p.subtotal,
                p.iva_total,
                p.total,
                COUNT(dp.id) as total_items
            FROM pedidos p
            LEFT JOIN detalle_pedidos dp ON p.id = dp.pedido_id
            WHERE p.usuario_id = %s
            GROUP BY p.id
            ORDER BY p.fecha DESC
        """, (USUARIO_DEFAULT,))
        pedidos = cursor.fetchall()
        
        # Para cada pedido, obtener sus detalles
        for pedido in pedidos:
            cursor.execute("""
                SELECT 
                    dp.cantidad,
                    dp.precio_unitario,
                    dp.subtotal,
                    pr.nombre,
                    pr.foto
                FROM detalle_pedidos dp
                INNER JOIN productos pr ON dp.producto_id = pr.id
                WHERE dp.pedido_id = %s
            """, (pedido['id'],))
            pedido['items'] = cursor.fetchall()
        
        return pedidos
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pedidos: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.get("/pedidos/{pedido_id}")
def get_pedido_detalle(pedido_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Obtener información del pedido
        cursor.execute("""
            SELECT * FROM pedidos WHERE id = %s AND usuario_id = %s
        """, (pedido_id, USUARIO_DEFAULT))
        pedido = cursor.fetchone()
        
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        
        # Obtener detalles del pedido
        cursor.execute("""
            SELECT 
                dp.cantidad,
                dp.precio_unitario,
                dp.subtotal,
                p.nombre,
                p.foto
            FROM detalle_pedidos dp
            INNER JOIN productos p ON dp.producto_id = p.id
            WHERE dp.pedido_id = %s
        """, (pedido_id,))
        pedido['items'] = cursor.fetchall()
        
        return pedido
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pedido: {str(e)}")
    finally:
        cursor.close()
        conn.close()