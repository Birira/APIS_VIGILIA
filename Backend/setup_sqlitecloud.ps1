# Script de instalación para SQLite Cloud
# Ejecutar: .\setup_sqlitecloud.ps1

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN DE SQLite Cloud" -ForegroundColor Yellow
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Python
Write-Host "1. Verificando Python..." -ForegroundColor Green
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✓ Python instalado: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Python no encontrado" -ForegroundColor Red
    Write-Host "   Instala Python desde: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 2. Instalar dependencias
Write-Host "2. Instalando dependencias..." -ForegroundColor Green
Write-Host "   (sqlitecloud, python-dotenv, etc.)" -ForegroundColor Gray
pip install -r requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Dependencias instaladas correctamente" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Crear archivo .env
Write-Host "3. Configurando archivo .env..." -ForegroundColor Green
if (Test-Path ".env") {
    Write-Host "   ⚠ El archivo .env ya existe" -ForegroundColor Yellow
    $respuesta = Read-Host "   ¿Deseas sobrescribirlo? (s/n)"
    if ($respuesta -ne "s") {
        Write-Host "   Manteniendo archivo existente" -ForegroundColor Gray
    }
    else {
        Copy-Item ".env.example" ".env" -Force
        Write-Host "   ✓ Archivo .env creado desde plantilla" -ForegroundColor Green
    }
}
else {
    Copy-Item ".env.example" ".env"
    Write-Host "   ✓ Archivo .env creado desde plantilla" -ForegroundColor Green
}
Write-Host ""

# 4. Solicitar credenciales
Write-Host "4. Configuración de SQLite Cloud" -ForegroundColor Green
Write-Host "   (Puedes editar .env manualmente después)" -ForegroundColor Gray
Write-Host ""

$configurar = Read-Host "   ¿Deseas configurar SQLite Cloud ahora? (s/n)"
if ($configurar -eq "s") {
    Write-Host ""
    Write-Host "   Ingresa tus credenciales de SQLite Cloud:" -ForegroundColor Cyan
    Write-Host "   (Obtén las credenciales en: https://sqlitecloud.io/dashboard)" -ForegroundColor Gray
    Write-Host ""
    
    $modo = Read-Host "   ¿Usar SQLite Cloud (cloud) o local (local)? [cloud/local]"
    if ($modo -eq "") { $modo = "cloud" }
    
    if ($modo -eq "cloud") {
        Write-Host ""
        Write-Host "   Opción A: Connection String completo" -ForegroundColor Yellow
        Write-Host "   Formato: sqlitecloud://user:password@host.sqlite.cloud:8860/database.db" -ForegroundColor Gray
        $connectionString = Read-Host "   Connection String (Enter para saltar)"
        
        if ($connectionString -ne "") {
            # Actualizar .env con connection string
            (Get-Content ".env") | ForEach-Object {
                $_ -replace "^DATABASE_MODE=.*", "DATABASE_MODE=$modo" `
                   -replace "^SQLITECLOUD_CONNECTION_STRING=.*", "SQLITECLOUD_CONNECTION_STRING=$connectionString"
            } | Set-Content ".env"
            
            Write-Host "   ✓ Configuración guardada" -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "   Opción B: Valores individuales" -ForegroundColor Yellow
            $host_input = Read-Host "   Host (ej: xxxxx.sqlite.cloud)"
            $user_input = Read-Host "   Usuario (ej: admin)"
            $pass_input = Read-Host "   Password" -AsSecureString
            $pass_plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass_input)
            )
            $db_input = Read-Host "   Base de datos [sensores.db]"
            if ($db_input -eq "") { $db_input = "sensores.db" }
            
            # Actualizar .env
            (Get-Content ".env") | ForEach-Object {
                $_ -replace "^DATABASE_MODE=.*", "DATABASE_MODE=$modo" `
                   -replace "^SQLITECLOUD_HOST=.*", "SQLITECLOUD_HOST=$host_input" `
                   -replace "^SQLITECLOUD_USER=.*", "SQLITECLOUD_USER=$user_input" `
                   -replace "^SQLITECLOUD_PASSWORD=.*", "SQLITECLOUD_PASSWORD=$pass_plain" `
                   -replace "^SQLITECLOUD_DATABASE=.*", "SQLITECLOUD_DATABASE=$db_input"
            } | Set-Content ".env"
            
            Write-Host "   ✓ Configuración guardada" -ForegroundColor Green
        }
    }
    else {
        # Modo local
        (Get-Content ".env") | ForEach-Object {
            $_ -replace "^DATABASE_MODE=.*", "DATABASE_MODE=local"
        } | Set-Content ".env"
        
        Write-Host "   ✓ Configurado en modo LOCAL" -ForegroundColor Green
    }
}
else {
    Write-Host "   Recuerda editar .env con tus credenciales" -ForegroundColor Yellow
}
Write-Host ""

# 5. Probar conexión
Write-Host "5. Probando conexión..." -ForegroundColor Green
Write-Host ""
python test_connection.py

Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN COMPLETADA" -ForegroundColor Yellow
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar el servidor:" -ForegroundColor White
Write-Host "   python main.py" -ForegroundColor Cyan
Write-Host "   o" -ForegroundColor Gray
Write-Host "   uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host ""