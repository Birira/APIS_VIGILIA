import sqlite3
from contextlib import contextmanager


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect("sensores.db")
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