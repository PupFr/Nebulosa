#!/bin/bash

echo "🔧 Configurando OAuth para usar localhost temporalmente..."

# Backup del .env actual
cp .env .env.backup

# Usar configuración localhost
cp .env.localhost .env

echo "✅ Configuración cambiada a localhost"
echo "📋 Ahora necesitas agregar esta URI a tu app de Zoom:"
echo "   http://localhost:3000/auth/zoom/callback"
echo ""
echo "🔗 URL de prueba:"
echo "https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread%20meeting%3Awrite%20user%3Aread&state=test123"
