#uvicorn main:app --reload
#docker build -t simpl .
#docker run -it -p 8000:8000 proyecto

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import get_db_connection, crea_tabla_datos, crea_tabla_sonido
from routers import temperatura, sonido


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inicializar base de datos
    crea_tabla_datos()
    crea_tabla_sonido()
    yield
    # Shutdown: Limpieza si es necesaria (opcional)

app = FastAPI(
    title="Sensores API",
    description="API para gestión de datos de sensores",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.100.19:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(temperatura.router)
app.include_router(sonido.router)

@app.get("/")
def read_root():
    """Obtiene todos los registros de la base de datos"""
    try:
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute("SELECT id, temperatura, fecha_registro FROM datos")
            results = c.fetchall()
        
        # Convert to list of dictionaries for JSON response
        data = [
            {
                "id": row[0],
                "temperatura": row[1],
                "fecha_registro": row[2]
            }
            for row in results
        ]
        return {"data": data}
    except Exception as e:
        print(f"Error in read_root: {str(e)}")
        return {"data": [], "error": str(e)}
