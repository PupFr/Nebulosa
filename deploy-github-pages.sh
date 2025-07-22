#!/bin/bash

# 🚀 GitHub Pages Deployment - 100% FREE
echo "🚀 DEPLOYING TO GITHUB PAGES (FREE)"
echo "===================================="

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git remote add origin https://github.com/PupFr/Nebulosa.git
fi

# Create GitHub Pages specific structure
echo "📁 Creating GitHub Pages structure..."

# Create a gh-pages directory with optimized structure
mkdir -p gh-pages
cp 404.html gh-pages/
cp docs-*.html gh-pages/
cp favicon.svg gh-pages/
cp zoom-callback.html gh-pages/  # HTML version for static hosting
cp .htaccess gh-pages/ 2>/dev/null || true

# Create index.html that redirects to docs
cat > gh-pages/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LA NUBE BOT - Redirecting...</title>
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <meta http-equiv="refresh" content="0; url=docs-index.html">
    <script>window.location.href = 'docs-index.html';</script>
</head>
<body>
    <p>Redirecting to <a href="docs-index.html">LA NUBE BOT Documentation</a>...</p>
</body>
</html>
EOF

# Rename docs-index.html to index.html for GitHub Pages
cp docs-index.html gh-pages/docs.html

echo "✅ Files prepared for GitHub Pages"
echo ""
echo "📤 To deploy, run these commands:"
echo "git add gh-pages/"
echo "git commit -m 'Deploy LA NUBE BOT to GitHub Pages'"
echo "git push origin main"
echo ""
echo "Then enable GitHub Pages in repository settings:"
echo "1. Go to: https://github.com/PupFr/Nebulosa/settings/pages"
echo "2. Source: Deploy from a branch"
echo "3. Branch: main"
echo "4. Folder: /gh-pages"
echo ""
echo "🌐 Your site will be available at:"
echo "https://pupfr.github.io/nebulosa/"
echo "https://pupfr.github.io/nebulosa/404.html"
echo "https://pupfr.github.io/nebulosa/docs.html"
echo ""
echo "💡 To use custom domain (pupfrisky.com):"
echo "1. Add CNAME file with your domain"
echo "2. Configure DNS: CNAME pupfrisky.com -> pupfr.github.io"
