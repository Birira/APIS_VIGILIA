import sqlite3
import os
from contextlib import contextmanager

# Intentar importar sqlitecloud, si no está disponible usar sqlite3 local
try:
    import sqlitecloud
    SQLITECLOUD_AVAILABLE = True
except ImportError:
    SQLITECLOUD_AVAILABLE = False
    print("⚠️  SQLite Cloud no está instalado. Usando SQLite local.")

# Configuración
DATABASE_MODE = os.getenv("DATABASE_MODE", "local")  # "cloud" o "local"
SQLITECLOUD_CONNECTION_STRING = os.getenv("SQLITECLOUD_CONNECTION_STRING", "")

# Configuración alternativa por componentes
SQLITECLOUD_HOST = os.getenv("SQLITECLOUD_HOST", "")
SQLITECLOUD_PORT = os.getenv("SQLITECLOUD_PORT", "8860")
SQLITECLOUD_USER = os.getenv("SQLITECLOUD_USER", "")
SQLITECLOUD_PASSWORD = os.getenv("SQLITECLOUD_PASSWORD", "")
SQLITECLOUD_DATABASE = os.getenv("SQLITECLOUD_DATABASE", "sensores.db")

LOCAL_DATABASE = "sensores.db"


def _get_cloud_connection():
    """Obtiene conexión a SQLite Cloud"""
    if not SQLITECLOUD_AVAILABLE:
        raise ImportError("sqlitecloud no está instalado. Instala con: pip install sqlitecloud")
    
    # Usar connection string si está disponible
    if SQLITECLOUD_CONNECTION_STRING:
        conn = sqlitecloud.connect(SQLITECLOUD_CONNECTION_STRING)
    else:
        # Construir connection string desde componentes
        if not all([SQLITECLOUD_HOST, SQLITECLOUD_USER, SQLITECLOUD_PASSWORD]):
            raise ValueError(
                "Faltan credenciales de SQLite Cloud. "
                "Configura SQLITECLOUD_CONNECTION_STRING o los valores individuales en .env"
            )
        
        connection_string = (
            f"sqlitecloud://{SQLITECLOUD_USER}:{SQLITECLOUD_PASSWORD}"
            f"@{SQLITECLOUD_HOST}:{SQLITECLOUD_PORT}/{SQLITECLOUD_DATABASE}"
        )
        conn = sqlitecloud.connect(connection_string)
    
    return conn


def _get_local_connection():
    """Obtiene conexión a SQLite local"""
    return sqlite3.connect(LOCAL_DATABASE)


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    if DATABASE_MODE == "cloud" and SQLITECLOUD_AVAILABLE:
        print("🌐 Conectando a SQLite Cloud...")
        conn = _get_cloud_connection()
    else:
        if DATABASE_MODE == "cloud":
            print("⚠️  Modo cloud solicitado pero no disponible. Usando SQLite local.")
        conn = _get_local_connection()
    
    try:
        yield conn
    finally:
        conn.close()


def crea_tabla_datos():
    """Initialize the database schema"""
    with get_db_connection() as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS datos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                temperatura REAL,
                humedad REAL,
                fecha_registro TIMESTAMP
            )
        """)
        conn.commit()

def crea_tabla_sonido():
    """Initialize the database schema"""
    with get_db_connection() as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS sonido (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sonido INTEGER,
                fecha_registro TIMESTAMP
            )
        """)
        conn.commit()

def crea_tabla_configuracion():
    """Crea la tabla de configuración de horarios"""
    with get_db_connection() as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS configuracion_horarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hora_inicio INTEGER NOT NULL,
                hora_fin INTEGER NOT NULL,
                activo BOOLEAN DEFAULT 1,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Insertar horarios por defecto si no existen
        c.execute("SELECT COUNT(*) FROM configuracion_horarios")
        if c.fetchone()[0] == 0:
            c.execute("""
                INSERT INTO configuracion_horarios (hora_inicio, hora_fin) 
                VALUES (9, 10), (16, 17)
            """)
        conn.commit()