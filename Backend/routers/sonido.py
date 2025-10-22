from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import JSONResponse, Response
from database.connection import get_db_connection
from typing import List
from pydantic import BaseModel

router = APIRouter(
    prefix="/sonido",
    tags=["sonido"]
)

# Fecha y hora actual en GMT-3
gmt_minus_3 = timezone(timedelta(hours=-3))

class HorarioConfig(BaseModel):
    hora_inicio: int
    hora_fin: int

def obtener_rangos_permitidos():
    """Obtiene los rangos horarios desde la base de datos"""
    with get_db_connection() as conn:
        c = conn.cursor()
        c.execute("SELECT hora_inicio, hora_fin FROM configuracion_horarios WHERE activo = 1")
        return c.fetchall()

@router.get("/horarios")
async def obtener_horarios():
    """Retorna los horarios configurados para que el Arduino los consulte"""
    try:
        rangos = obtener_rangos_permitidos()
        return JSONResponse(content={
            "rangos": [{"inicio": r[0], "fin": r[1]} for r in rangos],
            "timezone": "GMT-3"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/horarios")
async def configurar_horarios(horarios: List[HorarioConfig]):
    """Permite al usuario configurar nuevos horarios"""
    try:
        with get_db_connection() as conn:
            c = conn.cursor()
            # Desactivar horarios anteriores
            c.execute("UPDATE configuracion_horarios SET activo = 0")
            # Insertar nuevos horarios
            for horario in horarios:
                if not (0 <= horario.hora_inicio < 24 and 0 <= horario.hora_fin <= 24):
                    raise HTTPException(status_code=400, detail="Horas deben estar entre 0 y 24")
                if horario.hora_inicio >= horario.hora_fin:
                    raise HTTPException(status_code=400, detail="Hora de inicio debe ser menor que hora de fin")
                c.execute(
                    "INSERT INTO configuracion_horarios (hora_inicio, hora_fin) VALUES (?, ?)",
                    (horario.hora_inicio, horario.hora_fin)
                )
            conn.commit()
        return JSONResponse(content={"status": "OK", "message": "Horarios actualizados correctamente"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def recibir_datos(sonido: int = Form(...)):
    """Recibe y guarda datos de sonido (solo en horarios permitidos)"""
    try:
        dt = datetime.now(gmt_minus_3)
        hora_actual = dt.hour
        
        # Obtener rangos permitidos desde la base de datos
        rangos = obtener_rangos_permitidos()
        
        # Verificar si la hora actual está en algún rango permitido
        permitido = any(inicio <= hora_actual < fin for inicio, fin in rangos)
        
        if not permitido:
            # Retornar 204 No Content para no sobrecargar con errores
            return Response(status_code=204)
        
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO sonido (sonido, fecha_registro) VALUES (?, ?)",
                (sonido, dt.strftime("%Y-%m-%d %H:%M:%S"))
            )
            conn.commit()
        return JSONResponse(content={"status": "OK", "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S")})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def read_sound():
    """Obtiene todos los registros de la base de datos"""
    try:
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute("SELECT sonido, fecha_registro FROM sonido")
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