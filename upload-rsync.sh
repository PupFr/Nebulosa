#!/usr/bin/env bash

# Script rsync para subida rápida de documentación
echo "🚀 Subida via rsync (SSH) a pupfrisky.com"

## Configuración (puedes pasar [SSH_USER] [SSH_HOST] [REMOTE_PATH] como argumentos)
DEFAULT_SSH_USER="${SSH_USER:-$USER}"
if [ -n "$1" ]; then
    SSH_USER="$1"
else
    read -p "👤 SSH User (default: $DEFAULT_SSH_USER): " SSH_USER
    SSH_USER=${SSH_USER:-$DEFAULT_SSH_USER}
fi
if [ -n "$2" ]; then
    SSH_HOST="$2"
else
    read -p "🌐 Host (default: pupfrisky.com): " SSH_HOST
    SSH_HOST=${SSH_HOST:-pupfrisky.com}
fi
if [ -n "$3" ]; then
    REMOTE_PATH="$3"
else
    read -p "📁 Ruta remota (default: /home/$SSH_USER/public_html): " REMOTE_PATH
    REMOTE_PATH=${REMOTE_PATH:-/home/$SSH_USER/public_html}
fi

echo ""
echo "📋 Configuración rsync:"
echo "Host: $SSH_HOST"
echo "Usuario: $SSH_USER"
echo "Ruta: $REMOTE_PATH"
echo ""

## List of files to upload (local remote)
files=(
    "zoom-callback.php zoom-callback.php"
    "zoom-callback.html zoom-callback.html"
    "docs-index.html docs.html"
    "docs-setup.html docs-setup.html"
    "docs-oauth.html docs-oauth.html"
    "docs-multipin.html docs-multipin.html"
    "docs-shortio.html docs-shortio.html"
    "404.html 404.html"
    "favicon.svg favicon.svg"
    ".htaccess .htaccess"
)

echo "📤 Subiendo archivos con rsync..."
success_count=0
total_files=${#files[@]}

for pair in "${files[@]}"; do
    # split local and remote filenames
    local_file="${pair%% *}"
    remote_file="${pair#* }"
    
    echo "📤 Subiendo $local_file → $remote_file"
    
    if rsync -avz --progress "$local_file" "$SSH_USER@$SSH_HOST:$REMOTE_PATH/$remote_file"; then
        echo "✅ $remote_file subido"
        success_count=$((success_count + 1))
    else
        echo "❌ Error subiendo $remote_file"
    fi
done

echo ""
echo "📊 Resumen:"
echo "✅ Archivos subidos: $success_count/$total_files"

if [[ $success_count -eq $total_files ]]; then
    echo "🎉 ¡Subida completada al 100%!"
    
    echo ""
    echo "🌐 URLs disponibles:"
    echo "🔐 OAuth: https://$SSH_HOST/zoom-callback.php"
    echo "📚 Docs: https://$SSH_HOST/docs.html"
    echo "🔧 Setup: https://$SSH_HOST/docs-setup.html"
    echo "🔐 OAuth Guide: https://$SSH_HOST/docs-oauth.html"
    echo "📌 Multipin: https://$SSH_HOST/docs-multipin.html"
    echo "🔗 Short.io: https://$SSH_HOST/docs-shortio.html"
    
    echo ""
    echo "✅ Configuración sugerida para Short.io:"
    echo "pupfrisky.com/docs → https://$SSH_HOST/docs.html"
    echo "pupfrisky.com/setup → https://$SSH_HOST/docs-setup.html"
    echo "pupfrisky.com/oauth → https://$SSH_HOST/docs-oauth.html"
    
else
    echo "⚠️ Algunos archivos no se subieron correctamente"
    exit 1
fi
