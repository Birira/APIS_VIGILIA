from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import JSONResponse
from database.connection import get_db_connection

router = APIRouter(
    prefix="/temperatura",
    tags=["temperatura"]
)

# Fecha y hora actual en GMT-3
gmt_minus_3 = timezone(timedelta(hours=-3))


@router.post("")
async def recibir_datos(temperatura: float = Form(...), humedad: float = Form(...)):
    """Recibe y guarda datos de temperatura y humedad"""
    try:
        dt = datetime.now(gmt_minus_3)
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO datos (temperatura, humedad, fecha_registro) VALUES (?, ?, ?)",
                (temperatura, humedad, dt.strftime("%Y-%m-%d %H:%M:%S"))
            )
            conn.commit()
        return JSONResponse(content={"status": "OK"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
