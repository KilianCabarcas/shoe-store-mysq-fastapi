import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  
        database="ecommerce"
    )
    print("¡Conexión exitosa!")
    conn.close()
except Exception as e:
    print("Error de conexión:", e)