#uvicorn main:app --reload

from fastapi import *
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
import sqlite3

from read_colmena import read_colmena

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

def init_db():
    conn = sqlite3.connect("sensores.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperatura REAL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@app.get("/")
def read_root():
    colmena = read_colmena()
    res = colmena.to_json(orient="records")
    return json.loads(res)

@app.post("/datos")
async def recibir_datos(
    temperatura: float = Form(...)
):
    try:
        conn = sqlite3.connect("sensores.db")
        c = conn.cursor()
        c.execute(
            "INSERT INTO datos (temperatura) VALUES (?)",
            (temperatura)
        )
        conn.commit()
        conn.close()
        return JSONResponse(content={"status": "OK"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    init_db()
    uvicorn.run("main:app", host="0.0.0.0", port=5000)