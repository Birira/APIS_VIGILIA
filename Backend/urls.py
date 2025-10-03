#uvicorn main:app --reload
#docker build -t simpl .
#docker run -it -p 8000:8000 proyecto

from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
import sqlite3

app = FastAPI()

#fecha y hora actual en GMT-3
gmt_minus_3 = timezone(timedelta(hours=-3))

# Obtener la fecha y hora actual en GMT-3
dt = datetime.now(gmt_minus_3)

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
            sonido REAL,
            peso REAL,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@app.get("/")
def read_root():
    try:
        conn = sqlite3.connect("sensores.db")
        c = conn.cursor()
        c.execute("SELECT id, temperatura, sonido, peso, fecha_registro FROM datos")
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
    temperatura: float = Form(...),
    sonido: float = Form(None),
    peso: float = Form(None)
):
    try:
        conn = sqlite3.connect("sensores.db")
        c = conn.cursor()
        c.execute(
            "INSERT INTO datos (temperatura, sonido, peso, fecha_registro) VALUES (?, ?, ?, ?)",
            (temperatura, sonido, peso, dt.strftime("%Y-%m-%d %H:%M:%S"))
        )
        conn.commit()
        conn.close()
        return JSONResponse(content={"status": "OK"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize database on startup

init_db()

