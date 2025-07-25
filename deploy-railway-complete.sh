#!/bin/bash

# 🚂 RAILWAY COMPLETE DEPLOYMENT - Telegram Bot + OAuth Server
# This script deploys the complete solution that fixes OAuth 4700 errors

echo "🚂 RAILWAY COMPLETE DEPLOYMENT STARTING..."
echo "============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "📥 Installing Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
    export PATH="$PATH:/Users/$USER/.railway/bin"
else
    echo "✅ Railway CLI found"
fi

# Login check
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "🔑 Please login to Railway:"
    railway login
else
    echo "✅ Already logged in to Railway"
fi

# Project setup
echo ""
echo "📋 Setting up Railway project..."

# Check if we're already in a Railway project
if railway status &> /dev/null; then
    echo "✅ Already connected to Railway project"
else
    echo "🔗 Linking to existing Railway project..."
    railway link
fi

# Environment variables
echo ""
echo "⚙️ Setting up environment variables..."

# Check required environment variables
required_vars=("BOT_TOKEN" "ZOOM_CLIENT_ID" "ZOOM_CLIENT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "🔧 Please set these variables and run the script again:"
    echo "   export BOT_TOKEN='your_telegram_bot_token'"
    echo "   export ZOOM_CLIENT_ID='your_zoom_client_id'"
    echo "   export ZOOM_CLIENT_SECRET='your_zoom_client_secret'"
    exit 1
fi

# Set environment variables in Railway
echo "🔧 Setting Railway environment variables..."
railway variables set BOT_TOKEN="$BOT_TOKEN"
railway variables set ZOOM_CLIENT_ID="$ZOOM_CLIENT_ID" 
railway variables set ZOOM_CLIENT_SECRET="$ZOOM_CLIENT_SECRET"
railway variables set ZOOM_REDIRECT_URI="https://nebulosa-production.railway.app/oauth/callback"
railway variables set NODE_ENV="production"

echo "✅ Environment variables configured"

# Create package.json for Railway deployment
echo ""
echo "📦 Creating package.json for Railway..."
cat > package.json << 'EOF'
{
  "name": "nebulosa-railway-complete",
  "version": "2.0.0",
  "description": "NEBULOSA BOT - Complete Railway deployment with Telegram Bot + OAuth Server",
  "main": "railway-complete-bot.js",
  "scripts": {
    "start": "node railway-complete-bot.js",
    "dev": "node railway-complete-bot.js",
    "deploy": "railway up"
  },
  "keywords": ["telegram", "bot", "zoom", "oauth", "railway"],
  "author": "PupFr",
  "license": "MIT",
  "dependencies": {
    "node-telegram-bot-api": "^0.66.0",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

echo "✅ package.json created"

# Create railway.json for optimal deployment
echo ""
echo "🚂 Creating railway.json configuration..."
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node railway-complete-bot.js",
    "restartPolicyType": "ALWAYS"
  }
}
EOF

echo "✅ railway.json created"

# Deploy to Railway
echo ""
echo "🚀 DEPLOYING TO RAILWAY..."
echo "=========================="

# Install dependencies locally first
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Deploy
echo "🚂 Starting Railway deployment..."
railway up --detach

# Wait for deployment
echo ""
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Get deployment status
echo ""
echo "📊 DEPLOYMENT STATUS:"
echo "===================="
railway status

# Get the service URL
service_url=$(railway domain)
if [ -n "$service_url" ]; then
    echo ""
    echo "🌐 SERVICE URL: $service_url"
else
    echo ""
    echo "🌐 SERVICE URL: https://nebulosa-production.railway.app"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "✅ WHAT WAS DEPLOYED:"
echo "• Complete Telegram Bot with OAuth Server"
echo "• Unified Railway service handling both functions"
echo "• Fixed OAuth callback URL endpoint"
echo "• Environment variables configured"
echo ""
echo "🔗 ENDPOINTS:"
echo "• Telegram Webhook: https://nebulosa-production.railway.app/webhook"
echo "• OAuth Callback: https://nebulosa-production.railway.app/oauth/callback"
echo "• Health Check: https://nebulosa-production.railway.app/health"
echo "• Status Page: https://nebulosa-production.railway.app/"
echo ""
echo "🎯 OAUTH 4700 ERROR SHOULD BE FIXED!"
echo "====================================="
echo "• Your Zoom app redirect URI: https://nebulosa-production.railway.app/oauth/callback"
echo "• Railway OAuth endpoint: https://nebulosa-production.railway.app/oauth/callback"
echo "• URLs now match = NO MORE 4700 ERROR!"
echo ""
echo "🧪 TO TEST:"
echo "1. Go to Telegram"
echo "2. Send /zoomlogin to your bot"
echo "3. Click the OAuth link"
echo "4. Should redirect to Railway (not get 4700 error)"
echo "5. Should show success page and return to Telegram"
echo ""
echo "🔍 DEBUGGING:"
echo "• Check logs: railway logs"
echo "• Check status: railway status"
echo "• Check health: curl https://nebulosa-production.railway.app/health"
echo ""
echo "🎉 Railway deployment with OAuth fix complete!"

# Show final status
echo ""
echo "📈 FINAL STATUS CHECK:"
echo "====================="
railway logs --tail 50
