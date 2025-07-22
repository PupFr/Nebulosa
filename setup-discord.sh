#!/bin/bash

# 💜 Quick Discord Setup for LA NUBE BOT
echo "💜 DISCORD SETUP WIZARD"
echo "======================"

echo "📋 This will help you set up Discord integration for LA NUBE BOT"
echo ""

# Check if Discord webhook is already configured
if grep -q "DISCORD_WEBHOOK_URL" .env 2>/dev/null; then
    echo "✅ Discord webhook already configured in .env"
else
    echo "🔗 Setting up Discord webhook..."
    echo ""
    echo "📱 To get your Discord webhook URL:"
    echo "1. Open Discord and go to your server"
    echo "2. Server Settings → Integrations → Webhooks"
    echo "3. Click 'New Webhook'"
    echo "4. Name it 'LA NUBE BOT'"
    echo "5. Choose a channel (e.g., #bot-notifications)"
    echo "6. Copy the webhook URL"
    echo ""
    
    read -p "💬 Paste your Discord webhook URL: " WEBHOOK_URL
    
    if [ ! -z "$WEBHOOK_URL" ]; then
        echo "" >> .env
        echo "# Discord Integration" >> .env
        echo "DISCORD_WEBHOOK_URL=$WEBHOOK_URL" >> .env
        echo "✅ Discord webhook added to .env"
    else
        echo "⚠️ No webhook URL provided, skipping..."
    fi
fi

echo ""
echo "🧪 Testing Discord integration..."

# Test the Discord notification
if [ -f "discord-notifier.js" ]; then
    node -e "
    require('dotenv').config();
    const DiscordNotifier = require('./discord-notifier');
    
    if (process.env.DISCORD_WEBHOOK_URL) {
        const notifier = new DiscordNotifier(process.env.DISCORD_WEBHOOK_URL);
        notifier.notifyBotStartup().then(() => {
            console.log('✅ Test notification sent to Discord!');
        }).catch(err => {
            console.log('❌ Failed to send test notification:', err.message);
        });
    } else {
        console.log('⚠️ DISCORD_WEBHOOK_URL not found in .env');
    }
    "
else
    echo "⚠️ discord-notifier.js not found"
fi

echo ""
echo "🚀 DEPLOYMENT OPTIONS WITH DISCORD:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣ GitHub Actions + Discord (100% FREE)"
echo "   ✅ Auto-deploy on code changes"  
echo "   ✅ Discord notifications for deployments"
echo "   ✅ GitHub Pages hosting"
echo "   📁 Setup: Push to GitHub, enable Actions"
echo ""
echo "2️⃣ Manual deployment with Discord notifications"
echo "   ✅ Deploy to any platform"
echo "   ✅ Get notified on Discord"
echo "   📁 Use: ./deploy-github-pages.sh (with Discord notifications)"
echo ""
echo "3️⃣ Railway + Discord (FREE tier)"
echo "   ✅ Host full Node.js bot"
echo "   ✅ Discord notifications" 
echo "   ✅ 24/7 uptime"
echo "   📁 Cost: FREE up to 500 hours/month"
echo ""

echo "💡 Next steps:"
echo "• Add DISCORD_WEBHOOK_URL to GitHub Secrets for Actions"
echo "• Test deployments with Discord notifications"
echo "• Configure bot to send OAuth/multipin notifications"
echo ""
echo "🎉 Discord integration ready!"
