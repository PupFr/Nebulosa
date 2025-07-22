#!/bin/bash

# Script de subida automática para LA NUBE BOT
# Sube archivos de documentación y callback a pupfrisky.com

echo "🚀 Iniciando subida de archivos a pupfrisky.com..."

# Configuración (modifica estos valores)
REMOTE_HOST="pupfrisky.com"
REMOTE_USER="tu_usuario_ftp"
REMOTE_PATH="/public_html"

# Verificar que los archivos existen
echo "📋 Verificando archivos..."
files_to_upload=(
    "zoom-callback.php:zoom-callback.php"
    "zoom-callback.html:zoom-callback.html" 
    "docs-index.html:docs.html"
    "docs-setup.html:docs-setup.html"
    "docs-oauth.html:docs-oauth.html"
    "docs-multipin.html:docs-multipin.html"
    "docs-shortio.html:docs-shortio.html"
)

missing_files=()
for file_mapping in "${files_to_upload[@]}"; do
    local_file=$(echo $file_mapping | cut -d: -f1)
    if [[ ! -f "$local_file" ]]; then
        missing_files+=("$local_file")
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo "❌ Faltan archivos:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ Todos los archivos encontrados"

# Función para subir archivo via SCP
upload_file() {
    local_file=$1
    remote_file=$2
    
    echo "📤 Subiendo $local_file → $remote_file"
    
    if scp "$local_file" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/$remote_file"; then
        echo "✅ $remote_file subido exitosamente"
    else
        echo "❌ Error subiendo $remote_file"
        return 1
    fi
}

# Subir cada archivo
echo ""
echo "📤 Iniciando subida de archivos..."
for file_mapping in "${files_to_upload[@]}"; do
    local_file=$(echo $file_mapping | cut -d: -f1)
    remote_file=$(echo $file_mapping | cut -d: -f2)
    
    if ! upload_file "$local_file" "$remote_file"; then
        echo "💥 Error crítico. Deteniendo script."
        exit 1
    fi
done

echo ""
echo "🎉 ¡Subida completada exitosamente!"
echo ""
echo "📋 URLs disponibles:"
echo "🔐 OAuth: https://pupfrisky.com/zoom-callback.php"
echo "📚 Docs: https://pupfrisky.com/docs.html"
echo "🔧 Setup: https://pupfrisky.com/docs-setup.html"
echo "🔐 OAuth Guide: https://pupfrisky.com/docs-oauth.html"
echo "📌 Multipin: https://pupfrisky.com/docs-multipin.html"
echo "🔗 Short.io: https://pupfrisky.com/docs-shortio.html"
echo ""
echo "✅ Listo para configurar en Short.io y Zoom!"
