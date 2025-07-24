#!/bin/bash

# 🚂 Railway Auto-Deploy Script
echo "🚂 Setting up Railway deployment..."
echo "=================================="

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    exit 1
fi

echo "🔐 Logging into Railway..."
railway login

echo "📁 Linking project..."
railway link

echo "🔧 Setting environment variables..."

# Core bot configuration
railway variables set BOT_TOKEN="8113796108:AAHEK9UdLgsR46-ctyLaivtxIp6kWV1zr74"
railway variables set AUTHORIZED_GROUP_ID="-1002726059191"

# Zoom OAuth configuration
railway variables set ZOOM_USER_CLIENT_ID="vGVyI0IRv6si45iKO_qIw"
railway variables set ZOOM_USER_CLIENT_SECRET="qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6"
railway variables set ZOOM_CLIENT_ID="vGVyI0IRv6si45iKO_qIw"
railway variables set ZOOM_CLIENT_SECRET="qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6"
railway variables set ZOOM_REDIRECT_URI="https://pupfr.github.io/Nebulosa/zoom-callback.html"
railway variables set ZOOM_SECRET_TOKEN="8yf0TomZRhywR46LqmpuPw"

# Railway deployment configuration
railway variables set PORT="3000"
railway variables set NODE_ENV="production"
railway variables set RAILWAY_STATIC_URL="nebulosa-production.railway.app"

echo "✅ All environment variables set!"

echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Check your deployment:"
echo "• Logs: railway logs"
echo "• Status: railway status"  
echo "• Domain: railway domain"
echo ""
echo "🤖 Your bot should now be running without ETELEGRAM 404 errors!"
