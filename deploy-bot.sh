#!/bin/bash

# 🚀 Zoom Telegram Bot Deployment Script

echo "🤖 Zoom Telegram Bot Deployment"
echo "==============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install node-telegram-bot-api axios express dotenv

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
# Telegram Bot Token (get from @BotFather)
BOT_TOKEN=your_telegram_bot_token_here

# Zoom OAuth Configuration
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_SECRET_TOKEN=your_zoom_secret_token
ZOOM_REDIRECT_URI=https://your-domain.com/auth/zoom/callback

# Server Configuration
PORT=3000

# Optional: Admin User IDs (comma-separated)
ADMIN_USERS=123456789,987654321
EOL
    echo "📝 Template .env file created!"
    echo "   Please edit .env with your actual credentials before starting the bot."
    echo ""
fi

# Check if production-bot.js exists
if [ ! -f "production-bot.js" ]; then
    echo "❌ production-bot.js not found in current directory"
    echo "   Make sure you're in the correct directory"
    exit 1
fi

echo "✅ production-bot.js found"

# Create start script
cat > start-bot.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting Zoom Telegram Bot..."
echo "Press Ctrl+C to stop the bot"
echo ""
node production-bot.js
EOL

chmod +x start-bot.sh

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your actual credentials:"
echo "   - Get BOT_TOKEN from @BotFather on Telegram"
echo "   - Get Zoom OAuth credentials from Zoom Marketplace"
echo "   - Set your callback URL"
echo ""
echo "2. Start the bot:"
echo "   ./start-bot.sh"
echo "   or"
echo "   node production-bot.js"
echo ""
echo "3. Test OAuth flow after Zoom app approval (24-72 hours)"
echo ""
echo "📚 For detailed setup instructions, see BOT-README.md"
echo ""
echo "🔗 Useful links:"
echo "   - Telegram BotFather: https://t.me/BotFather"
echo "   - Zoom Marketplace: https://marketplace.zoom.us/"
echo "   - Documentation: https://pupfr.github.io/Nebulosa/"
