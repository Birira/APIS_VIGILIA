#uvicorn main:app --reload

from fastapi import FastAPI, Form, HTTPException
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
    "http://127.0.0.1:5173",
    "http://192.168.100.19:5173",  # If your frontend runs on this IP
    "*",  # Allow all origins (remove this in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        conn = sqlite3.connect("sensores.db")
        c = conn.cursor()
        c.execute("SELECT id, temperatura, sonido, peso, fecha_registro FROM 'Modelo de datos'")
        results = c.fetchall()
        conn.close()
        
        # Convert to list of dictionaries for JSON response
        data = [
            {"id": row[0], "temperatura": row[1], "sonido": row[2], "peso": row[3], "fecha_registro": row[4]}
            for row in results
        ]
        return {"data": data}
    except Exception as e:
        print(f"Error in read_root: {str(e)}")
        return {"data": [], "error": str(e)}

@app.get("/ping")
def ping():
    """Simple endpoint to test API connectivity"""
    return {"status": "ok", "message": "API is running"}

@app.post("/datos")
async def recibir_datos(
    temperatura: float = Form(...)
):
    try:
        conn = sqlite3.connect("sensores.db")
        c = conn.cursor()
        c.execute(
            "INSERT INTO datos (temperatura) VALUES (?)",
            (temperatura,)
        )
        conn.commit()
        conn.close()
        return JSONResponse(content={"status": "OK"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    init_db()
    uvicorn.run("urls:app", host="192.168.100.19", port=8000)