# 🌐 Migración a SQLite Cloud

Este proyecto ahora soporta **SQLite Cloud** para almacenamiento en la nube, manteniendo compatibilidad con SQLite local para desarrollo.

## 📋 Requisitos Previos

1. **Cuenta de SQLite Cloud**
   - Regístrate en: https://sqlitecloud.io/
   - Crea un nuevo proyecto/cluster
   - Obtén tus credenciales de conexión

## 🚀 Instalación

### 1. Instalar dependencias

```powershell
cd Backend
pip install -r requirements.txt
```

Esto instalará:
- `sqlitecloud==0.0.90` - Cliente de SQLite Cloud
- `python-dotenv==1.0.0` - Para cargar variables de entorno

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `Backend`:

```powershell
```bash
cp .env.example .env
```
```

Edita `.env` con tus credenciales de SQLite Cloud:

#### Opción A: Connection String (Recomendado)
```env
DATABASE_MODE=cloud
SQLITECLOUD_CONNECTION_STRING=sqlitecloud://admin:your_password@your_host.sqlite.cloud:8860/sensores.db
```

#### Opción B: Valores Individuales
```env
DATABASE_MODE=cloud
SQLITECLOUD_HOST=your_host.sqlite.cloud
SQLITECLOUD_PORT=8860
SQLITECLOUD_USER=admin
SQLITECLOUD_PASSWORD=your_password
SQLITECLOUD_DATABASE=sensores.db
```

### 3. Ejecutar el servidor

```powershell
cd Backend
python main.py
```

O con uvicorn:
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Modos de Operación

### Modo Cloud (Producción)
```env
DATABASE_MODE=cloud
```
- Usa SQLite Cloud
- Datos accesibles desde cualquier lugar
- Respaldos automáticos
- Escalable

### Modo Local (Desarrollo)
```env
DATABASE_MODE=local
```
- Usa SQLite local (`sensores.db`)
- No requiere conexión a internet
- Ideal para desarrollo y pruebas

## 📊 Obtener Credenciales de SQLite Cloud

1. Ve a https://sqlitecloud.io/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Connection Strings**
4. Copia el connection string que tiene este formato:
   ```
   sqlitecloud://admin:password@xxxxx.sqlite.cloud:8860/database.db
   ```

## 🔍 Verificar Conexión

El servidor mostrará en consola al iniciar:

```
🗄️  Modo de base de datos: CLOUD
🚀 Iniciando aplicación...
🌐 Conectando a SQLite Cloud...
✅ Base de datos inicializada correctamente
```

O si está en modo local:
```
🗄️  Modo de base de datos: LOCAL
🚀 Iniciando aplicación...
✅ Base de datos inicializada correctamente
```

## 🛠️ Solución de Problemas

### Error: "sqlitecloud no está instalado"
```powershell
pip install sqlitecloud
```

### Error: "Faltan credenciales de SQLite Cloud"
- Verifica que tu archivo `.env` existe
- Confirma que las credenciales son correctas
- Asegúrate de que el host incluye `.sqlite.cloud`

### Error de conexión a SQLite Cloud
- Verifica tu conexión a internet
- Confirma que el puerto 8860 no está bloqueado por firewall
- Revisa que tu cuenta de SQLite Cloud está activa

### Usar SQLite local temporalmente
Si SQLite Cloud falla, el sistema automáticamente usa SQLite local:
```env
DATABASE_MODE=local
```

## 📦 Estructura de Archivos

```
Backend/
├── .env                    # Tu configuración (NO SUBIR A GIT)
├── .env.example            # Plantilla de configuración
├── sensores.db            # Base de datos local (solo modo local)
├── main.py                # Aplicación principal
├── requirements.txt       # Dependencias
└── database/
    └── connection.py      # Gestión de conexiones
```

## 🔐 Seguridad

**IMPORTANTE:** 
- ⚠️ Nunca subas el archivo `.env` a Git
- ⚠️ Usa contraseñas fuertes para SQLite Cloud
- ⚠️ Agrega `.env` a tu `.gitignore`

```gitignore
# .gitignore
.env
*.db
__pycache__/
```

## 🌍 Beneficios de SQLite Cloud

✅ **Acceso remoto**: Tu Arduino puede conectarse desde cualquier lugar  
✅ **Sin servidor**: No necesitas configurar servidores  
✅ **Respaldos automáticos**: Datos seguros  
✅ **Escalable**: Crece con tu proyecto  
✅ **Compatible**: Mismo SQL que SQLite  
✅ **Rápido**: Baja latencia  

## 📞 Soporte

- SQLite Cloud Docs: https://docs.sqlitecloud.io/
- SQLite Cloud Dashboard: https://sqlitecloud.io/dashboard

## 🔄 Migrar Datos Existentes

Si ya tienes datos en SQLite local (`sensores.db`):

1. Exporta los datos:
```powershell
sqlite3 sensores.db .dump > backup.sql
```

2. Conéctate a SQLite Cloud y ejecuta el dump:
```python
import sqlitecloud

conn = sqlitecloud.connect("tu_connection_string")
with open('backup.sql', 'r') as f:
    conn.executescript(f.read())
```

3. Cambia a modo cloud en `.env`

---

¡Tu proyecto ahora está listo para usar SQLite Cloud! 🚀
