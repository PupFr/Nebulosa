#!/bin/bash

echo "🚂 NEBULOSA RAILWAY DEPLOYMENT"
echo "=============================="
echo "Token: f116a0ab-8170-432d-a69a-f94f23d4a726"
echo ""

# Set Railway token
export RAILWAY_TOKEN="f116a0ab-8170-432d-a69a-f94f23d4a726"

echo "🔐 Configuring Railway CLI with your token..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    
    if [ $? -eq 0 ]; then
        echo "✅ Railway CLI installed successfully!"
    else
        echo "❌ Failed to install Railway CLI"
        echo "Please install manually: npm install -g @railway/cli"
        exit 1
    fi
else
    echo "✅ Railway CLI already installed"
fi

echo ""
echo "🚀 DEPLOYING NEBULOSA BOT TO RAILWAY"
echo ""

# Login with token
echo "🔑 Authenticating with Railway..."
echo "$RAILWAY_TOKEN" | railway login --token

if [ $? -eq 0 ]; then
    echo "✅ Successfully authenticated with Railway!"
else
    echo "❌ Authentication failed"
    exit 1
fi

# Initialize Railway project
echo ""
echo "🏗️ Setting up Railway project..."

# Check if already initialized
if [ ! -f ".railway/config.json" ]; then
    railway init
    echo "✅ Railway project initialized!"
else
    echo "✅ Railway project already configured"
fi

# Deploy the bot
echo ""
echo "🚀 Deploying Nebulosa Bot..."
echo ""

# Set environment variables for Railway
echo "⚙️ Setting environment variables..."
railway variables set BOT_TOKEN="$BOT_TOKEN"
railway variables set ZOOM_CLIENT_ID="vGVyI0IRv6si45iKO_qIw"
railway variables set ZOOM_CLIENT_SECRET="$ZOOM_CLIENT_SECRET"
railway variables set ZOOM_SECRET_TOKEN="$ZOOM_SECRET_TOKEN"
railway variables set PORT="3000"

# Get Railway URL for OAuth callback
RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null || echo "https://nebulosa-production.railway.app")
railway variables set ZOOM_REDIRECT_URI="${RAILWAY_URL}/auth/zoom/callback"

echo "🌐 Railway URL: $RAILWAY_URL"
echo "🔄 OAuth Callback: ${RAILWAY_URL}/auth/zoom/callback"

# Deploy
echo ""
echo "🚀 Starting deployment..."
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "========================"
    echo ""
    echo "🤖 Nebulosa Bot is now live!"
    echo "🌐 URL: $RAILWAY_URL"
    echo "🔄 OAuth: ${RAILWAY_URL}/auth/zoom/callback"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update Zoom app redirect URI with: ${RAILWAY_URL}/auth/zoom/callback"
    echo "2. Test bot with /start command"
    echo "3. Try /zoomlogin after Zoom app approval"
    echo ""
    echo "📊 Monitor deployment:"
    echo "railway logs --follow"
    echo ""
    echo "🎯 Bot features ready:"
    echo "✅ 17 Telegram commands"
    echo "✅ Zoom OAuth integration"
    echo "✅ Meeting management"
    echo "✅ Real-time monitoring"
    echo "✅ Browser automation"
    echo "✅ Bilingual support"
    echo ""
else
    echo "❌ Deployment failed"
    echo "Check logs with: railway logs"
    exit 1
fi
