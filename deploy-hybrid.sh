#!/bin/bash

echo "🔄 HYBRID DEPLOYMENT: RAILWAY + VERCEL"
echo "====================================="
echo ""

# Vercel Token
export VERCEL_TOKEN="nIQ94iBPU8jZBmvlMqg4xmz8"

# Railway Token  
export RAILWAY_TOKEN="f116a0ab-8170-432d-a69a-f94f23d4a726"

echo "🎯 DEPLOYMENT STRATEGY:"
echo "• Railway: Production environment (always-on)"
echo "• Vercel: Preview/staging deploys"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    
    if [ $? -eq 0 ]; then
        echo "✅ Vercel CLI installed successfully!"
    else
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
else
    echo "✅ Vercel CLI already installed"
fi

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    
    if [ $? -eq 0 ]; then
        echo "✅ Railway CLI installed successfully!"
    else
        echo "❌ Failed to install Railway CLI"
        exit 1
    fi
else
    echo "✅ Railway CLI already installed"
fi

echo ""
echo "🔐 Authenticating with both platforms..."

# Login to Vercel
echo "🔗 Vercel authentication..."
echo "$VERCEL_TOKEN" | vercel login --token

if [ $? -eq 0 ]; then
    echo "✅ Vercel authentication successful!"
else
    echo "❌ Vercel authentication failed"
    exit 1
fi

# Login to Railway (will need manual completion)
echo ""
echo "🚂 Railway authentication..."
echo "Visit: https://railway.com/cli-login?d=d29yZENvZGU9dGVhbC10aG9yb3VnaC1taW5kZnVsbmVzcyZob3N0bmFtZT1mcmlza3ktZ2hvc3Q="
echo "Pairing code: teal-thorough-mindfulness"

# Set up Vercel project
echo ""
echo "🔧 Setting up Vercel project..."

# Create or link Vercel project
vercel link

if [ $? -eq 0 ]; then
    echo "✅ Vercel project linked!"
else
    echo "⚠️  Creating new Vercel project..."
    vercel --yes
fi

# Set Vercel environment variables for preview
echo ""
echo "⚙️ Setting Vercel environment variables..."

vercel env add BOT_TOKEN_PREVIEW preview
vercel env add ZOOM_CLIENT_ID preview  
vercel env add ZOOM_CLIENT_SECRET preview
vercel env add ZOOM_SECRET_TOKEN preview
vercel env add ZOOM_REDIRECT_URI_PREVIEW preview

echo ""
echo "🎉 HYBRID DEPLOYMENT CONFIGURED!"
echo "==============================="
echo ""

echo "📊 DEPLOYMENT ENVIRONMENTS:"
echo ""

echo "🚂 RAILWAY (Production):"
echo "• URL: https://nebulosa-production.railway.app"
echo "• Environment: production"
echo "• Features: Always-on, V2 runtime, multi-region"
echo "• Cost: $5-8/month"
echo ""

echo "⚡ VERCEL (Preview/Staging):"
echo "• URL: https://nebulosa-telegram-bot-preview.vercel.app"
echo "• Environment: preview"
echo "• Features: Serverless, auto-scaling, branch previews"
echo "• Cost: Free tier (generous limits)"
echo ""

echo "🔄 DEPLOYMENT WORKFLOW:"
echo ""

echo "1. DEVELOPMENT:"
echo "   • Work on feature branches"
echo "   • Push to GitHub"
echo "   • Vercel auto-creates preview deploys"
echo ""

echo "2. STAGING:"
echo "   • Test features on Vercel previews"
echo "   • Validate with preview bot token"
echo "   • Check OAuth flow with preview callback"
echo ""

echo "3. PRODUCTION:"
echo "   • Merge to main branch"
echo "   • Railway auto-deploys to production"
echo "   • Always-on bot serves real users"
echo ""

echo "🎯 NEXT STEPS:"
echo ""

echo "1. Deploy Preview to Vercel:"
echo "   vercel --prod"
echo ""

echo "2. Configure Production on Railway:"
echo "   railway up"
echo ""

echo "3. Set Environment Variables:"
echo ""
echo "   RAILWAY (Production):"
echo "   • BOT_TOKEN=production_bot_token"
echo "   • ZOOM_REDIRECT_URI=https://nebulosa-production.railway.app/auth/zoom/callback"
echo "   • NODE_ENV=production"
echo ""
echo "   VERCEL (Preview):"
echo "   • BOT_TOKEN_PREVIEW=preview_bot_token"
echo "   • ZOOM_REDIRECT_URI_PREVIEW=https://your-preview.vercel.app/auth/zoom/callback"
echo "   • NODE_ENV=preview"
echo ""

echo "4. Test Both Environments:"
echo "   • Preview: Test new features safely"
echo "   • Production: Serve real users reliably"
echo ""

echo "🎉 HYBRID DEPLOYMENT READY!"
echo "Best of both worlds: Railway reliability + Vercel flexibility!"
