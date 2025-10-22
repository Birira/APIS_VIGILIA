# 🚀 Guía Rápida - SQLite Cloud

## 📦 Instalación Rápida (3 pasos)

### 1️⃣ Instalar dependencias

**Windows (PowerShell):**
```powershell
cd Backend
pip install -r requirements.txt
```

**Linux/Mac:**
```bash
cd Backend
pip3 install -r requirements.txt
```

### 2️⃣ Configurar credenciales

**Windows (PowerShell):**
```powershell
# Opción A: Script automático (recomendado)
.\setup_sqlitecloud.ps1

# Opción B: Manual
Copy-Item .env.example .env
# Edita .env con tus credenciales
```

**Linux/Mac:**
```bash
# Opción A: Script automático (recomendado)
chmod +x setup_sqlitecloud.sh
./setup_sqlitecloud.sh

# Opción B: Manual
cp .env.example .env
# Edita .env con tus credenciales
```

### 3️⃣ Iniciar servidor

**Windows:**
```powershell
python main.py
```

**Linux/Mac:**
```bash
python3 main.py
```

---

## 🔑 Obtener Credenciales de SQLite Cloud

1. Ir a https://sqlitecloud.io/
2. Crear cuenta gratuita
3. Crear nuevo proyecto
4. Copiar connection string desde Dashboard
5. Pegar en archivo `.env`

**Ejemplo de connection string:**
```
sqlitecloud://admin:tu_password@xxxxx.sqlite.cloud:8860/sensores.db
```

---

## ⚙️ Configuración Manual (.env)

```env
DATABASE_MODE=cloud
SQLITECLOUD_CONNECTION_STRING=sqlitecloud://admin:password@host.sqlite.cloud:8860/sensores.db
```

---

## 🧪 Probar Conexión

**Windows:**
```powershell
python test_connection.py
```

**Linux/Mac:**
```bash
python3 test_connection.py
```

**Salida esperada:**
```
🗄️  Modo de base de datos: CLOUD
🔌 Intentando conectar a SQLite Cloud...
✅ ¡Conexión exitosa a SQLite Cloud!
📊 Versión de SQLite: 3.x.x
```

---

## 🔄 Cambiar entre Cloud y Local

**Modo Cloud (Producción):**
```env
DATABASE_MODE=cloud
```

**Modo Local (Desarrollo):**
```env
DATABASE_MODE=local
```

---

## 📱 Actualizar Arduino

El Arduino debe usar la IP pública de tu servidor con SQLite Cloud:

```cpp
const char* serverIP = "tu_ip_publica_o_dominio";
const int serverPort = 8000;
```

---

## ✅ Checklist

- [ ] Python instalado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Cuenta de SQLite Cloud creada
- [ ] Archivo `.env` configurado
- [ ] Conexión probada (`python test_connection.py`)
- [ ] Servidor iniciado (`python main.py`)
- [ ] Arduino actualizado con nueva IP

---

## 🆘 Problemas Comunes

**"sqlitecloud no está instalado"**

Windows:
```powershell
pip install sqlitecloud
```

Linux/Mac:
```bash
pip3 install sqlitecloud
```

**"Faltan credenciales"**
- Verifica que `.env` existe
- Confirma que `DATABASE_MODE=cloud`
- Revisa que el connection string es correcto

**Error de conexión**
- Verifica conexión a internet
- Confirma puerto 8860 abierto
- Revisa credenciales en SQLite Cloud dashboard

**Permisos en Linux (setup_sqlitecloud.sh)**
```bash
chmod +x setup_sqlitecloud.sh
```

---

## 📚 Documentación Completa

Ver `SQLITE_CLOUD_SETUP.md` para más detalles.

---

## 💡 Ventajas

✅ Acceso remoto desde cualquier lugar  
✅ Sin necesidad de servidor propio  
✅ Respaldos automáticos  
✅ Escalable  
✅ Compatible con SQLite estándar  

---

¿Necesitas ayuda? Revisa la documentación oficial: https://docs.sqlitecloud.io/
