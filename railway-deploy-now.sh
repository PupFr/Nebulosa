#!/bin/bash

echo "🚀 ONE-CLICK RAILWAY DEPLOYMENT"
echo "==============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Check if package-bot.json exists and rename it
if [ -f "package-bot.json" ] && [ ! -f "package.json" ]; then
    echo "📦 Setting up package.json..."
    cp package-bot.json package.json
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOL'
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
logs/

# OS generated files
.DS_Store
Thumbs.db

# Development files
basic-bot-implementation.js

# Railway
.railway/
EOL
fi

# Add all files to git
echo "📤 Preparing files for deployment..."
git add .
git status

echo ""
echo "🎯 DEPLOYMENT CHECKLIST:"
echo "========================"
echo ""

# Check required files
echo "📋 Required Files:"
if [ -f "production-bot.js" ]; then
    echo "✅ production-bot.js - Main bot file"
else
    echo "❌ production-bot.js - MISSING!"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json - Dependencies"
else
    echo "❌ package.json - MISSING!"
fi

if [ -f "railway.json" ]; then
    echo "✅ railway.json - Railway config"
else
    echo "❌ railway.json - MISSING!"
fi

echo ""
echo "🔑 Environment Variables Needed:"
echo "• BOT_TOKEN (from @BotFather)"
echo "• ZOOM_CLIENT_ID"
echo "• ZOOM_CLIENT_SECRET" 
echo "• ZOOM_SECRET_TOKEN"
echo "• ZOOM_REDIRECT_URI"
echo "• PORT=3000"
echo ""

echo "🚂 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Commit your changes:"
echo "   git commit -m 'Railway deployment ready'"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/your-repo.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy on Railway:"
echo "   • Go to: https://railway.app"
echo "   • Sign up with GitHub"
echo "   • Click 'New Project'"
echo "   • Select 'Deploy from GitHub repo'"
echo "   • Choose your repository"
echo ""
echo "4. Set Environment Variables:"
echo "   • Go to Variables tab in Railway"
echo "   • Add all required environment variables"
echo "   • Railway will auto-deploy!"
echo ""
echo "5. Update Zoom Redirect URI:"
echo "   • Your Railway URL: https://your-app.railway.app"
echo "   • Callback: https://your-app.railway.app/auth/zoom/callback"
echo ""

echo "💰 COST: ~$5/month (with $5 free credit!)"
echo "🎉 Your bot will be live in minutes!"
echo ""

read -p "Ready to commit changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Committing changes..."
    git commit -m "Railway deployment ready - all files configured"
    echo "✅ Changes committed!"
    echo ""
    echo "🔗 Now push to GitHub and deploy on Railway!"
else
    echo "ℹ️  Changes staged but not committed."
    echo "   Run 'git commit -m \"Your message\"' when ready."
fi

echo ""
echo "📚 For detailed instructions, see:"
echo "   • RAILWAY-DEPLOYMENT.md"
echo "   • ./deploy-railway.sh"
