import sqlite3
import pandas as pd

# 1. Cargar el CSV con pandas
df = pd.read_csv("datos_colmena.csv")

# 2. Conectar a una base de datos SQLite (se crea si no existe)
conn = sqlite3.connect("sensores.db")

# 3. Subir el DataFrame como tabla en SQLite
df.to_sql("Modelo de datos", conn, if_exists="replace", index=False)

# 4. Verificar que los datos estén cargados (ejemplo: seleccionar 5 registros)
cursor = conn.cursor()
cursor.execute("SELECT * FROM 'Modelo de datos'")
print(cursor.fetchall())

# 5. Cerrar conexión
conn.close()