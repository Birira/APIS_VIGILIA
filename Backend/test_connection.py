"""
Script para probar la conexión a SQLite Cloud
Ejecutar: python test_connection.py
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

print("=" * 60)
print("  PRUEBA DE CONEXIÓN - SQLite Cloud")
print("=" * 60)
print()

# Mostrar configuración (sin mostrar password completo)
DATABASE_MODE = os.getenv("DATABASE_MODE", "local")
print(f"📋 Modo de base de datos: {DATABASE_MODE.upper()}")
print()

if DATABASE_MODE == "cloud":
    SQLITECLOUD_CONNECTION_STRING = os.getenv("SQLITECLOUD_CONNECTION_STRING", "")
    SQLITECLOUD_HOST = os.getenv("SQLITECLOUD_HOST", "")
    
    if SQLITECLOUD_CONNECTION_STRING:
        # Ocultar password
        parts = SQLITECLOUD_CONNECTION_STRING.split('@')
        if len(parts) == 2:
            user_pass = parts[0].split('://')[-1]
            if ':' in user_pass:
                user = user_pass.split(':')[0]
                print(f"📡 Connection String configurado")
                print(f"   Usuario: {user}")
                print(f"   Host: {parts[1]}")
        else:
            print(f"📡 Connection String: {SQLITECLOUD_CONNECTION_STRING[:20]}...")
    elif SQLITECLOUD_HOST:
        SQLITECLOUD_USER = os.getenv("SQLITECLOUD_USER", "")
        print(f"📡 Configuración por componentes:")
        print(f"   Host: {SQLITECLOUD_HOST}")
        print(f"   Usuario: {SQLITECLOUD_USER}")
        print(f"   Puerto: {os.getenv('SQLITECLOUD_PORT', '8860')}")
        print(f"   Base de datos: {os.getenv('SQLITECLOUD_DATABASE', 'sensores.db')}")
    else:
        print("⚠️  No hay credenciales configuradas")
        print("   Crea un archivo .env basado en .env.example")
        exit(1)
    
    print()
    print("🔌 Intentando conectar a SQLite Cloud...")
    
    try:
        import sqlitecloud
        
        if SQLITECLOUD_CONNECTION_STRING:
            conn = sqlitecloud.connect(SQLITECLOUD_CONNECTION_STRING)
        else:
            connection_string = (
                f"sqlitecloud://{os.getenv('SQLITECLOUD_USER')}:{os.getenv('SQLITECLOUD_PASSWORD')}"
                f"@{SQLITECLOUD_HOST}:{os.getenv('SQLITECLOUD_PORT', '8860')}"
                f"/{os.getenv('SQLITECLOUD_DATABASE', 'sensores.db')}"
            )
            conn = sqlitecloud.connect(connection_string)
        
        print("✅ ¡Conexión exitosa a SQLite Cloud!")
        print()
        
        # Probar consulta simple
        cursor = conn.cursor()
        cursor.execute("SELECT sqlite_version()")
        version = cursor.fetchone()[0]
        print(f"📊 Versión de SQLite: {version}")
        
        # Listar tablas
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            ORDER BY name
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"📁 Tablas encontradas: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
                
                # Contar registros
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                count = cursor.fetchone()[0]
                print(f"     ({count} registros)")
        else:
            print("📁 No hay tablas creadas aún")
            print("   (Se crearán automáticamente al iniciar la aplicación)")
        
        conn.close()
        print()
        print("=" * 60)
        print("  ✅ PRUEBA COMPLETADA EXITOSAMENTE")
        print("=" * 60)
        
    except ImportError:
        print("❌ Error: sqlitecloud no está instalado")
        print("   Instala con: pip install sqlitecloud")
        exit(1)
    except Exception as e:
        print(f"❌ Error al conectar: {str(e)}")
        print()
        print("💡 Verifica:")
        print("   - Credenciales correctas en .env")
        print("   - Conexión a internet")
        print("   - Cuenta de SQLite Cloud activa")
        print("   - Firewall no bloquea puerto 8860")
        exit(1)

else:
    print("📁 Modo local activado")
    print("   Usando SQLite local (sensores.db)")
    print()
    
    try:
        import sqlite3
        
        conn = sqlite3.connect("sensores.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT sqlite_version()")
        version = cursor.fetchone()[0]
        print(f"📊 Versión de SQLite: {version}")
        
        # Listar tablas
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            ORDER BY name
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"📁 Tablas encontradas: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
                
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                count = cursor.fetchone()[0]
                print(f"     ({count} registros)")
        else:
            print("📁 No hay tablas creadas aún")
        
        conn.close()
        print()
        print("=" * 60)
        print("  ✅ CONEXIÓN LOCAL EXITOSA")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        exit(1)
