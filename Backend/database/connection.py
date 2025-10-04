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