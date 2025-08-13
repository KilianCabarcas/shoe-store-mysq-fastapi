from fastapi import FastAPI
from app.routes import auth, categoria, producto, carrito, pedido
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router)
app.include_router(categoria.router)
app.include_router(producto.router)
app.include_router(carrito.router)
app.include_router(pedido.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)