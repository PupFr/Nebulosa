#!/bin/bash

echo "🚂 NEBULOSA RAILWAY DEPLOYMENT"
echo "=============================="
echo "Project: Nebulosa Telegram Bot"
echo "Token: f116a0ab-8170-432d-a69a-f94f23d4a726"
echo ""

# Ensure we have package.json ready
if [ ! -f "package.json" ] && [ -f "package-bot.json" ]; then
    echo "📦 Creating package.json from package-bot.json..."
    cp package-bot.json package.json
    echo "✅ package.json ready"
fi

# Set Railway token environment
export RAILWAY_TOKEN="f116a0ab-8170-432d-a69a-f94f23d4a726"

echo "🔑 Authenticating with Railway..."

# Check if already logged in
railway whoami 2>/dev/null || {
    echo "Logging in with token..."
    echo "$RAILWAY_TOKEN" | railway login --token
}

if [ $? -eq 0 ]; then
    echo "✅ Railway authentication successful!"
    echo "👤 User: $(railway whoami)"
else
    echo "❌ Railway authentication failed"
    echo "Please check your token: f116a0ab-8170-432d-a69a-f94f23d4a726"
    exit 1
fi

echo ""
echo "🏗️ Setting up Railway project..."

# Check if project exists or create new one
if [ ! -f ".railway/config.json" ]; then
    echo "Creating new Railway project: Nebulosa"
    railway init --name "nebulosa-telegram-bot"
else
    echo "✅ Railway project already configured"
fi

echo ""
echo "⚙️ Setting up environment variables..."

# Set required environment variables
echo "Setting BOT_TOKEN..."
read -p "Enter your Telegram BOT_TOKEN: " BOT_TOKEN
railway variables set BOT_TOKEN="$BOT_TOKEN"

echo "Setting Zoom credentials..."
railway variables set ZOOM_CLIENT_ID="vGVyI0IRv6si45iKO_qIw"

read -p "Enter your ZOOM_CLIENT_SECRET: " ZOOM_CLIENT_SECRET
railway variables set ZOOM_CLIENT_SECRET="$ZOOM_CLIENT_SECRET"

read -p "Enter your ZOOM_SECRET_TOKEN: " ZOOM_SECRET_TOKEN
railway variables set ZOOM_SECRET_TOKEN="$ZOOM_SECRET_TOKEN"

railway variables set PORT="3000"

# Get the Railway domain
echo ""
echo "🌐 Getting Railway deployment URL..."
RAILWAY_DOMAIN=$(railway domain 2>/dev/null || echo "nebulosa-production.railway.app")

if [[ "$RAILWAY_DOMAIN" != *"railway.app"* ]]; then
    RAILWAY_DOMAIN="nebulosa-production.railway.app"
fi

OAUTH_CALLBACK="https://${RAILWAY_DOMAIN}/auth/zoom/callback"
railway variables set ZOOM_REDIRECT_URI="$OAUTH_CALLBACK"

echo "📡 Deployment URL: https://$RAILWAY_DOMAIN"
echo "🔄 OAuth Callback: $OAUTH_CALLBACK"

echo ""
echo "🚀 Deploying Nebulosa to Railway..."
echo "This may take a few minutes..."

# Deploy to Railway
railway up --detach

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 NEBULOSA DEPLOYMENT SUCCESSFUL!"
    echo "=================================="
    echo ""
    echo "🤖 Your Nebulosa Bot is now live!"
    echo "🌐 URL: https://$RAILWAY_DOMAIN"
    echo "🔄 OAuth Callback: $OAUTH_CALLBACK"
    echo ""
    echo "📋 IMPORTANT - Update Zoom App:"
    echo "1. Go to Zoom Marketplace"
    echo "2. Edit your OAuth app"
    echo "3. Set Redirect URI to: $OAUTH_CALLBACK"
    echo "4. Save changes"
    echo ""
    echo "🧪 Test Your Bot:"
    echo "1. Open Telegram"
    echo "2. Find your bot"
    echo "3. Send /start"
    echo "4. Try /botstatus"
    echo ""
    echo "📊 Monitor Deployment:"
    echo "railway logs --follow"
    echo ""
    echo "🎯 Available Commands (17 total):"
    echo "• /start - Welcome message"
    echo "• /zoomlogin - OAuth connection"
    echo "• /createroom - Create meeting"
    echo "• /monitor - Start monitoring"
    echo "• /startbot - Browser automation"
    echo "• And 12 more commands!"
    echo ""
else
    echo ""
    echo "❌ DEPLOYMENT FAILED"
    echo "==================="
    echo ""
    echo "🔍 Check deployment logs:"
    echo "railway logs"
    echo ""
    echo "🐛 Common issues:"
    echo "• Missing environment variables"
    echo "• Invalid bot token"
    echo "• Railway service limits"
    echo ""
    echo "💡 Try manual deployment:"
    echo "railway deploy"
fi

echo ""
echo "📚 Documentation:"
echo "• NEBULOSA-RAILWAY-CONFIG.md - Configuration guide"
echo "• RAILWAY-DEPLOYMENT.md - Complete deployment guide"
echo "• BOT-README.md - Bot usage instructions"
