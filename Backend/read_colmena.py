import pandas as pd
import sqlite3

def read_colmena():
    # Conectar a la base de datos SQLite
    conn = sqlite3.connect('sensores.db')
    # Leer la tabla "datos" utilizando pandas
    colmena = pd.read_sql('SELECT * FROM datos', conn)
    
    # Cerrar la conexión a la base de datos
    conn.close()
    
    # Retornar las primeras filas de la tabla
    return colmena.head()

""" print(read_colmena()) """