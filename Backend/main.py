from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import get_db_connection, crea_tabla_datos, crea_tabla_sonido, crea_tabla_configuracion
from routers import temperatura, sonido
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde .env
load_dotenv()

# Mostrar modo de base de datos
DATABASE_MODE = os.getenv("DATABASE_MODE", "local")
print(f"🗄️  Modo de base de datos: {DATABASE_MODE.upper()}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inicializar base de datos
    print("🚀 Iniciando aplicación...")
    try:
        crea_tabla_datos()
        crea_tabla_sonido()
        crea_tabla_configuracion()
        print("✅ Base de datos inicializada correctamente")
    except Exception as e:
        print(f"❌ Error al inicializar base de datos: {e}")
    yield
    # Shutdown: Limpieza si es necesaria (opcional)
    print("👋 Cerrando aplicación...")

app = FastAPI(
    title="Sensores API",
    description="API para gestión de datos de sensores",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
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
            c.execute("SELECT id, temperatura, humedad, fecha_registro FROM datos")
            results = c.fetchall()
        
        # Convert to list of dictionaries for JSON response
        data = [
            {
                "id": row[0],
                "temperatura": row[1],
                "humedad": row[2],
                "fecha_registro": row[3]
            }
            for row in results
        ]
        return {"data": data}
    except Exception as e:
        print(f"Error in read_root: {str(e)}")
        return {"data": [], "error": str(e)}


@app.get("/ping", tags=["health"])
def ping():
    """Verifica el estado de la API"""
    return {"status": "ok", "message": "API is running"}
