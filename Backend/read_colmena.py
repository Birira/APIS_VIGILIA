import pandas as pd

def read_colmena():
    colmena = pd.read_csv('ej_datos.csv')

    return colmena.head()
