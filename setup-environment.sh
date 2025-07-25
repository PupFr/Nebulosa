#!/bin/bash

# 🔧 ENVIRONMENT SETUP for Railway OAuth Fix
echo "🔧 ENVIRONMENT SETUP - Railway OAuth Fix"
echo "========================================"
echo ""

echo "This script will help you set up the environment variables needed"
echo "to fix the OAuth 4700 error by deploying to Railway with proper"
echo "OAuth callback URL configuration."
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "📄 Found existing .env file"
    echo "🔍 Current configuration:"
    echo ""
    grep -E "^(BOT_TOKEN|ZOOM_CLIENT_ID|ZOOM_CLIENT_SECRET)" .env | sed 's/=.*/=***/' 2>/dev/null || echo "   (No relevant variables found)"
    echo ""
    read -p "Do you want to update the existing .env file? (y/n): " update_env
    if [ "$update_env" != "y" ] && [ "$update_env" != "Y" ]; then
        echo "Keeping existing .env file"
        source .env
    else
        echo "🔄 Updating .env file..."
        setup_env=true
    fi
else
    echo "📄 No .env file found - creating new one"
    setup_env=true
fi

if [ "$setup_env" = true ]; then
    echo ""
    echo "🔑 Please provide your credentials:"
    echo ""
    
    # Get Telegram Bot Token
    echo "1️⃣ TELEGRAM BOT TOKEN"
    echo "   Get this from @BotFather on Telegram"
    read -p "   Enter your Telegram bot token: " bot_token
    echo ""
    
    # Get Zoom Client ID
    echo "2️⃣ ZOOM CLIENT ID"
    echo "   Get this from your Zoom Marketplace app"
    read -p "   Enter your Zoom Client ID: " zoom_client_id
    echo ""
    
    # Get Zoom Client Secret
    echo "3️⃣ ZOOM CLIENT SECRET"
    echo "   Get this from your Zoom Marketplace app"
    read -p "   Enter your Zoom Client Secret: " zoom_client_secret
    echo ""
    
    # Create .env file
    cat > .env << EOF
# NEBULOSA BOT - Railway OAuth Fix Configuration
BOT_TOKEN=$bot_token
ZOOM_CLIENT_ID=$zoom_client_id
ZOOM_CLIENT_SECRET=$zoom_client_secret
ZOOM_REDIRECT_URI=https://nebulosa-production.railway.app/oauth/callback
NODE_ENV=production

# Railway will automatically set:
# PORT=3000 (or dynamic port)
# RAILWAY_STATIC_URL=nebulosa-production.railway.app
EOF
    
    echo "✅ .env file created"
    source .env
fi

echo ""
echo "🔍 CONFIGURATION CHECK:"
echo "======================="
echo "BOT_TOKEN: ${BOT_TOKEN:0:10}... (${#BOT_TOKEN} chars)"
echo "ZOOM_CLIENT_ID: ${ZOOM_CLIENT_ID:0:10}... (${#ZOOM_CLIENT_ID} chars)"
echo "ZOOM_CLIENT_SECRET: ${ZOOM_CLIENT_SECRET:0:10}... (${#ZOOM_CLIENT_SECRET} chars)"
echo "ZOOM_REDIRECT_URI: ${ZOOM_REDIRECT_URI}"
echo ""

# Validate configuration
validation_passed=true

if [ ${#BOT_TOKEN} -lt 40 ]; then
    echo "❌ BOT_TOKEN seems too short (should be ~46 characters)"
    validation_passed=false
fi

if [ ${#ZOOM_CLIENT_ID} -lt 15 ]; then
    echo "❌ ZOOM_CLIENT_ID seems too short"
    validation_passed=false
fi

if [ ${#ZOOM_CLIENT_SECRET} -lt 20 ]; then
    echo "❌ ZOOM_CLIENT_SECRET seems too short"
    validation_passed=false
fi

if [ "$validation_passed" = true ]; then
    echo "✅ Configuration validation passed"
else
    echo "⚠️ Some values might be incorrect - please double-check"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo ""
echo "1. 🔧 ZOOM APP CONFIGURATION:"
echo "   Go to your Zoom Marketplace app settings"
echo "   Set redirect URI to: https://nebulosa-production.railway.app/oauth/callback"
echo ""
echo "2. 🚂 DEPLOY TO RAILWAY:"
echo "   Run: ./deploy-railway-complete.sh"
echo ""
echo "3. 🧪 TEST OAUTH:"
echo "   Use /zoomlogin in Telegram"
echo "   Should redirect to Railway (not get 4700 error)"
echo ""

# Export for current session
export BOT_TOKEN="$BOT_TOKEN"
export ZOOM_CLIENT_ID="$ZOOM_CLIENT_ID"
export ZOOM_CLIENT_SECRET="$ZOOM_CLIENT_SECRET"
export ZOOM_REDIRECT_URI="$ZOOM_REDIRECT_URI"

echo "✅ Environment variables exported for current session"
echo ""
echo "🚀 Ready to deploy! Run: ./deploy-railway-complete.sh"
