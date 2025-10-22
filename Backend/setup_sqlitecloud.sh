#!/bin/bash
# Script de instalación para SQLite Cloud
# Ejecutar: bash setup_sqlitecloud.sh o ./setup_sqlitecloud.sh

# Colores
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================================${NC}"
echo -e "${YELLOW}  CONFIGURACIÓN DE SQLite Cloud${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# 1. Verificar Python
echo -e "${GREEN}1. Verificando Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "   ${GREEN}✓ Python instalado: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "   ${GREEN}✓ Python instalado: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python"
else
    echo -e "   ${RED}✗ Python no encontrado${NC}"
    echo -e "   ${YELLOW}Instala Python desde: https://www.python.org/downloads/${NC}"
    exit 1
fi
echo ""

# 2. Instalar dependencias
echo -e "${GREEN}2. Instalando dependencias...${NC}"
echo -e "   ${GRAY}(sqlitecloud, python-dotenv, etc.)${NC}"
pip3 install -r requirements.txt --quiet 2>&1 || pip install -r requirements.txt --quiet 2>&1
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "   ${RED}✗ Error al instalar dependencias${NC}"
    exit 1
fi
echo ""

# 3. Crear archivo .env
echo -e "${GREEN}3. Configurando archivo .env...${NC}"
if [ -f ".env" ]; then
    echo -e "   ${YELLOW}⚠ El archivo .env ya existe${NC}"
    read -p "   ¿Deseas sobrescribirlo? (s/n): " respuesta
    if [ "$respuesta" != "s" ]; then
        echo -e "   ${GRAY}Manteniendo archivo existente${NC}"
    else
        cp ".env.example" ".env"
        echo -e "   ${GREEN}✓ Archivo .env creado desde plantilla${NC}"
    fi
else
    cp ".env.example" ".env"
    echo -e "   ${GREEN}✓ Archivo .env creado desde plantilla${NC}"
fi
echo ""

# 4. Solicitar credenciales
echo -e "${GREEN}4. Configuración de SQLite Cloud${NC}"
echo -e "   ${GRAY}(Puedes editar .env manualmente después)${NC}"
echo ""

read -p "   ¿Deseas configurar SQLite Cloud ahora? (s/n): " configurar
if [ "$configurar" = "s" ]; then
    echo ""
    echo -e "   ${CYAN}Ingresa tus credenciales de SQLite Cloud:${NC}"
    echo -e "   ${GRAY}(Obtén las credenciales en: https://sqlitecloud.io/dashboard)${NC}"
    echo ""
    
    read -p "   ¿Usar SQLite Cloud (cloud) o local (local)? [cloud/local]: " modo
    modo=${modo:-cloud}
    
    if [ "$modo" = "cloud" ]; then
        echo ""
        echo -e "   ${YELLOW}Opción A: Connection String completo${NC}"
        echo -e "   ${GRAY}Formato: sqlitecloud://user:password@host.sqlite.cloud:8860/database.db${NC}"
        read -p "   Connection String (Enter para saltar): " connectionString
        
        if [ -n "$connectionString" ]; then
            # Actualizar .env con connection string
            sed -i "s|^DATABASE_MODE=.*|DATABASE_MODE=$modo|" .env
            sed -i "s|^SQLITECLOUD_CONNECTION_STRING=.*|SQLITECLOUD_CONNECTION_STRING=$connectionString|" .env
            
            echo -e "   ${GREEN}✓ Configuración guardada${NC}"
        else
            echo ""
            echo -e "   ${YELLOW}Opción B: Valores individuales${NC}"
            read -p "   Host (ej: xxxxx.sqlite.cloud): " host_input
            read -p "   Usuario (ej: admin): " user_input
            read -sp "   Password: " pass_input
            echo ""
            read -p "   Base de datos [sensores.db]: " db_input
            db_input=${db_input:-sensores.db}
            
            # Actualizar .env
            sed -i "s|^DATABASE_MODE=.*|DATABASE_MODE=$modo|" .env
            sed -i "s|^SQLITECLOUD_HOST=.*|SQLITECLOUD_HOST=$host_input|" .env
            sed -i "s|^SQLITECLOUD_USER=.*|SQLITECLOUD_USER=$user_input|" .env
            sed -i "s|^SQLITECLOUD_PASSWORD=.*|SQLITECLOUD_PASSWORD=$pass_input|" .env
            sed -i "s|^SQLITECLOUD_DATABASE=.*|SQLITECLOUD_DATABASE=$db_input|" .env
            
            echo -e "   ${GREEN}✓ Configuración guardada${NC}"
        fi
    else
        # Modo local
        sed -i "s|^DATABASE_MODE=.*|DATABASE_MODE=local|" .env
        
        echo -e "   ${GREEN}✓ Configurado en modo LOCAL${NC}"
    fi
else
    echo -e "   ${YELLOW}Recuerda editar .env con tus credenciales${NC}"
fi
echo ""

# 5. Probar conexión
echo -e "${GREEN}5. Probando conexión...${NC}"
echo ""
$PYTHON_CMD test_connection.py

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${YELLOW}  CONFIGURACIÓN COMPLETADA${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "${NC}Para iniciar el servidor:${NC}"
echo -e "   ${CYAN}$PYTHON_CMD main.py${NC}"
echo -e "   ${GRAY}o${NC}"
echo -e "   ${CYAN}uvicorn main:app --reload${NC}"
echo ""
