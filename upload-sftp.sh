#!/bin/bash

# Script SFTP para subida de documentación LA NUBE BOT
echo "🚀 Subida via SFTP a pupfrisky.com"

# Solicitar credenciales
read -p "👤 Usuario SFTP: " SFTP_USER
read -p "🌐 Host (default: pupfrisky.com): " SFTP_HOST
SFTP_HOST=${SFTP_HOST:-pupfrisky.com}
read -p "📁 Ruta remota (default: /public_html): " REMOTE_PATH
REMOTE_PATH=${REMOTE_PATH:-/public_html}

echo "📋 Configuración:"
echo "Host: $SFTP_HOST"
echo "Usuario: $SFTP_USER"
echo "Ruta: $REMOTE_PATH"
echo ""

# Crear script temporal SFTP
cat > /tmp/sftp_upload_script << EOF
cd $REMOTE_PATH
put zoom-callback.php zoom-callback.php
put zoom-callback.html zoom-callback.html
put docs-index.html docs.html
put docs-setup.html docs-setup.html
put docs-oauth.html docs-oauth.html
put docs-multipin.html docs-multipin.html
put docs-shortio.html docs-shortio.html
ls -la *.php *.html
quit
EOF

echo "📤 Iniciando transferencia SFTP..."
if sftp -b /tmp/sftp_upload_script "$SFTP_USER@$SFTP_HOST"; then
    echo "✅ Subida completada exitosamente!"
    
    echo ""
    echo "🌐 URLs disponibles:"
    echo "🔐 https://$SFTP_HOST/zoom-callback.php"
    echo "📚 https://$SFTP_HOST/docs.html"
    echo "🔧 https://$SFTP_HOST/docs-setup.html"
    echo "🔐 https://$SFTP_HOST/docs-oauth.html"
    echo "📌 https://$SFTP_HOST/docs-multipin.html"
    echo "🔗 https://$SFTP_HOST/docs-shortio.html"
else
    echo "❌ Error en la transferencia SFTP"
    exit 1
fi

# Limpiar archivo temporal
rm -f /tmp/sftp_upload_script

echo ""
echo "✅ Proceso completado. Ahora puedes:"
echo "1. Configurar redirect URLs en Short.io"
echo "2. Actualizar OAuth settings en Zoom"
echo "3. Probar los enlaces con /docs en Telegram"
