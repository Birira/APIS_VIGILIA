from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import JSONResponse
from database.connection import get_db_connection

router = APIRouter(
    prefix="/sonido",
    tags=["sonido"]
)

# Fecha y hora actual en GMT-3
gmt_minus_3 = timezone(timedelta(hours=-3))


@router.post("")
async def recibir_datos(sonido: int = Form(...)):
    """Recibe y guarda datos de sonido (solo en horarios permitidos)"""
    try:
        dt = datetime.now(gmt_minus_3)
        hora_actual = dt.hour
        
        # Rangos horarios permitidos: (hora_inicio, hora_fin)
        # Ejemplo: 9-10 AM y 3-5 PM
        RANGOS_PERMITIDOS = [(9, 10), (16, 17)]
        
        # Verificar si la hora actual está en algún rango permitido
        permitido = any(inicio <= hora_actual < fin for inicio, fin in RANGOS_PERMITIDOS)
        
        if not permitido:
            rangos_str = ", ".join([f"{inicio}:00-{fin}:00" for inicio, fin in RANGOS_PERMITIDOS])
            raise HTTPException(
                status_code=403,
                detail=f"Datos solo pueden ser insertados en los siguientes horarios: {rangos_str}. Hora actual: {dt.strftime('%H:%M:%S')}"
            )
        
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO sonido (sonido, fecha_registro) VALUES (?, ?)",
                (sonido, dt.strftime("%Y-%m-%d %H:%M:%S"))
            )
            conn.commit()
        return JSONResponse(content={"status": "OK", "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S")})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def read_sound():
    """Obtiene todos los registros de la base de datos"""
    try:
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute("SELECT id, sonido, fecha_registro FROM sonido")
            results = c.fetchall()
        
        # Convert to list of dictionaries for JSON response
        data = [
            {
                "id": row[0],
                "sonido": row[1],
                "fecha_registro": row[2]
            }
            for row in results
        ]
        return {"data": data}
    except Exception as e:
        print(f"Error in read_root: {str(e)}")
        return {"data": [], "error": str(e)}