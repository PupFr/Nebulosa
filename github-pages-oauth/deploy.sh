#!/bin/bash

# 🚀 Deploy script para GitHub Pages OAuth

echo "🚀 DEPLOY A GITHUB PAGES"
echo "========================"

# Verificar si estamos en un repo git
if [ ! -d ".git" ]; then
    echo "❌ Este directorio no es un repositorio git"
    echo "💡 Ejecuta: git init"
    exit 1
fi

# Verificar archivos
if [ ! -f "index.html" ]; then
    echo "❌ No se encontró index.html"
    exit 1
fi

echo "📁 Archivos a subir:"
ls -la *.html *.md 2>/dev/null

echo ""
echo "📤 Subiendo a GitHub..."

git add .
git commit -m "🔐 OAuth callback para LA NUBE BOT - $(date)"
git push origin main

echo ""
echo "✅ Deploy completado!"
echo ""
echo "🌐 Tu OAuth callback estará disponible en:"
echo "https://[tu-usuario].github.io/[repo-name]/"
echo ""
echo "🔧 Para configurar GitHub Pages:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Settings → Pages"
echo "3. Source: Deploy from a branch"
echo "4. Branch: main, Folder: / (root)"
echo "5. Save"
echo ""
echo "⏱️ GitHub Pages puede tardar 5-10 minutos en activarse"
