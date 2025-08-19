from fastapi import FastAPI
from app.routes import auth, categoria, productos, carrito, pedido 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Agregar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categoria.router)
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(pedido.router)  

@app.get("/")
def read_root():
    return {"message": "Ecommerce Zapatos API"}