#!/bin/bash

# Script FTP para subida de documentación LA NUBE BOT
echo "🚀 Subida via FTP a pupfrisky.com"

# Configuración FTP
read -p "👤 Usuario FTP: " FTP_USER
read -s -p "🔐 Password FTP: " FTP_PASS
echo ""
read -p "🌐 Host FTP (default: pupfrisky.com): " FTP_HOST
FTP_HOST=${FTP_HOST:-pupfrisky.com}
read -p "📁 Directorio remoto (default: /public_html): " FTP_DIR
FTP_DIR=${FTP_DIR:-/public_html}

echo ""
echo "📋 Configuración FTP:"
echo "Host: $FTP_HOST"
echo "Usuario: $FTP_USER"
echo "Directorio: $FTP_DIR"
echo ""

# Verificar archivos
echo "📋 Verificando archivos locales..."
files=(
    "zoom-callback.php"
    "zoom-callback.html"
    "docs-index.html"
    "docs-setup.html"
    "docs-oauth.html"
    "docs-multipin.html"
    "docs-shortio.html"
)

for file in "${files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Archivo faltante: $file"
        exit 1
    fi
done

echo "✅ Todos los archivos encontrados"

# Crear script FTP temporal
cat > /tmp/ftp_upload_script << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd $FTP_DIR
binary
put zoom-callback.php zoom-callback.php
put zoom-callback.html zoom-callback.html
put docs-index.html docs.html
put docs-setup.html docs-setup.html
put docs-oauth.html docs-oauth.html
put docs-multipin.html docs-multipin.html
put docs-shortio.html docs-shortio.html
ls
quit
EOF

echo "📤 Subiendo archivos via FTP..."
if ftp -n < /tmp/ftp_upload_script; then
    echo "✅ Subida FTP completada!"
    
    echo ""
    echo "🌐 URLs verificar:"
    for file in "${files[@]}"; do
        if [[ "$file" == "docs-index.html" ]]; then
            echo "📚 https://$FTP_HOST/docs.html"
        else
            echo "📄 https://$FTP_HOST/${file}"
        fi
    done
    
else
    echo "❌ Error en subida FTP"
    exit 1
fi

# Limpiar
rm -f /tmp/ftp_upload_script

echo ""
echo "🎯 Próximos pasos:"
echo "1. Verifica que las URLs funcionen"
echo "2. Configura Short.io redirects"
echo "3. Actualiza Zoom OAuth settings"
echo "4. Prueba /zoomlogin en Telegram"
