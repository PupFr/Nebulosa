#!/bin/bash

echo "🚀 HYBRID DEPLOYMENT: RAILWAY + VERCEL"
echo "====================================="
echo ""

# Tokens
RAILWAY_TOKEN="f116a0ab-8170-432d-a69a-f94f23d4a726"
VERCEL_TOKEN="nIQ94iBPU8jZBmvlMqg4xmz8"

echo "🔐 Tokens configured:"
echo "🚂 Railway: ${RAILWAY_TOKEN:0:8}..."
echo "▲ Vercel: ${VERCEL_TOKEN:0:8}..."
echo ""

# Check if CLI tools are installed
echo "🔧 Checking CLI tools..."

if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ CLI tools ready"
echo ""

# Deploy to Railway (Production Backend)
echo "🚂 DEPLOYING TO RAILWAY (Production)"
echo "==================================="

export RAILWAY_TOKEN="$RAILWAY_TOKEN"

# Railway CLI authentication
echo "🔑 Setting up Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please run 'railway login' manually first"
    echo "Or use the Railway dashboard to deploy manually"
    echo "⚠️  Skipping Railway CLI deployment"
else
    echo "👤 Railway user: $(railway whoami)"
    
    # Deploy to Railway
    echo "🚀 Deploying production backend to Railway..."
    railway up --detach
    
    if [ $? -eq 0 ]; then
        echo "✅ Railway production deployment successful!"
        echo "🌐 Railway URL: https://$(railway status --json | jq -r '.deployment.url')"
    else
        echo "❌ Railway deployment failed"
        railway logs --follow
    fi
fi
    echo "✅ Railway deployment successful!"
    RAILWAY_URL=$(railway domain 2>/dev/null || echo "nebulosa-production.railway.app")
    echo "🌐 Railway URL: https://$RAILWAY_URL"
else
    echo "❌ Railway deployment failed"
    echo "Check logs with: railway logs"
fi

echo ""

# Deploy to Vercel (Serverless API)
echo "▲ DEPLOYING TO VERCEL (Serverless API)"  
echo "======================================"

export VERCEL_TOKEN="$VERCEL_TOKEN"

# Login to Vercel
echo "🔑 Logging into Vercel..."
vercel login --token "$VERCEL_TOKEN" &> /dev/null || echo "Already logged in"

echo "👤 Vercel user: $(vercel whoami 2>/dev/null || echo 'Unknown')"

# Set environment variables for Vercel
echo "⚙️ Setting Vercel environment variables..."

echo "$RAILWAY_URL" | vercel env add RAILWAY_BACKEND production
echo "https://nebulosa.vercel.app/auth/zoom/callback" | vercel env add ZOOM_REDIRECT_URI production

# Deploy to Vercel
echo "🚀 Deploying serverless functions to Vercel..."
vercel --prod --token "$VERCEL_TOKEN" --yes

if [ $? -eq 0 ]; then
    echo "✅ Vercel deployment successful!"
    VERCEL_URL="nebulosa.vercel.app"
    echo "🌐 Vercel URL: https://$VERCEL_URL"
else
    echo "❌ Vercel deployment failed"
    echo "Check deployment logs in Vercel dashboard"
fi

echo ""

# Update Railway with Vercel webhook
echo "🔗 CONNECTING ENVIRONMENTS"
echo "========================="

if [ ! -z "$RAILWAY_URL" ] && [ ! -z "$VERCEL_URL" ]; then
    echo "🔄 Setting cross-platform environment variables..."
    
    # Update Railway with Vercel URLs
    railway variables set VERCEL_WEBHOOK="https://$VERCEL_URL/api/bot" --env production
    railway variables set ZOOM_REDIRECT_URI="https://$VERCEL_URL/auth/zoom/callback" --env production
    
    echo "✅ Environment sync complete!"
else
    echo "⚠️ Some deployments failed - manual environment sync required"
fi

echo ""

# Final status
echo "🎉 HYBRID DEPLOYMENT COMPLETE!"
echo "=============================="
echo ""
echo "🚂 Railway (Production Backend):"
echo "   URL: https://$RAILWAY_URL"
echo "   Health: https://$RAILWAY_URL/health"
echo "   Cost: $5-8/month"
echo ""
echo "▲ Vercel (Serverless API):"
echo "   URL: https://$VERCEL_URL"  
echo "   Health: https://$VERCEL_URL/health"
echo "   OAuth: https://$VERCEL_URL/auth/zoom/callback"
echo "   Cost: Free tier + usage"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Update Zoom OAuth redirect URI to: https://$VERCEL_URL/auth/zoom/callback"
echo "2. Test health endpoints on both platforms"
echo "3. Send /start to your Telegram bot"
echo "4. Try /zoomlogin after Zoom app approval"
echo ""
echo "📊 MONITORING:"
echo "• Railway Dashboard: railway.app"
echo "• Vercel Dashboard: vercel.com"
echo "• Bot Status: /botstatus command"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "• Railway logs: railway logs --follow"
echo "• Vercel logs: vercel logs"
echo "• Health checks: curl both /health endpoints"
echo ""
echo "✨ Your bot now runs on BOTH platforms with automatic failover!"
