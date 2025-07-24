# 🤖 Zoom Telegram Bot

A powerful Telegram bot for managing Zoom meetings with OAuth integration, real-time monitoring, and automated features.

## ✨ Features

- **🔐 OAuth Integration**: Secure Zoom account connection
- **🎥 Meeting Management**: Create, monitor, and control meetings
- **👥 Participant Monitoring**: Real-time participant tracking
- **🤖 Browser Bot**: Automated multipin and visual monitoring
- **💬 Chat Integration**: Command processing and moderation
- **🌐 Bilingual Support**: English and Spanish
- **👑 Admin Controls**: Advanced management features

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install node-telegram-bot-api axios express dotenv
```

### 2. Configure Environment

Create a `.env` file:

```env
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token

# Zoom OAuth
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_SECRET_TOKEN=your_zoom_secret_token
ZOOM_REDIRECT_URI=https://your-domain.com/auth/zoom/callback

# Server
PORT=3000
```

### 3. Start the Bot

```bash
node production-bot.js
```

## 📋 Available Commands

### Basic Commands
- `/start` - Show welcome message and command list
- `/zoomlogin` - Connect your Zoom account via OAuth
- `/status` - Check current session status
- `/botstatus` - Detailed bot status information
- `/language` - Change language (English/Spanish)
- `/docs` - Access documentation and guides

### Meeting Management
- `/createroom [topic]` - Create instant meeting with auto-features
- `/roominfo` - Get current Zoom room information
- `/startsession` - Start Zoom session (Admin only)

### Monitoring & Control
- `/scanroom` - Advanced participant monitoring with auto-moderation
- `/monitor` - Start/stop automatic monitoring
- `/chatwatch` - Monitor and moderate Zoom chat
- `/promote [name]` - Promote user to co-host

### Browser Bot (Admin)
- `/startbot` - Start browser bot for multipin automation
- `/stopbot` - Stop browser bot automation
- `/shutdown` - Stop bot completely

### Integration
- `/commandchat` - Manage Command Chat integration

## 🔧 Setup Instructions

### 1. Create Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` command
3. Follow instructions to get your `BOT_TOKEN`

### 2. Set up Zoom OAuth App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Create new OAuth app
3. Set redirect URI to your callback URL
4. Get Client ID, Client Secret, and Secret Token

### 3. Deploy OAuth Callback

Your callback URL must be publicly accessible. Options:

- **Local development**: Use ngrok
- **Production**: Deploy to Heroku, Vercel, or your server

### 4. Configure Admin Users

Edit the `adminUsers` Set in `production-bot.js`:

```javascript
this.adminUsers = new Set([
    123456789,  // Your Telegram user ID
    987654321   // Another admin user ID
]);
```

## 🎯 Core Features

### OAuth Integration
- Secure Zoom account linking
- Token storage and refresh
- User session management

### Meeting Control
- Create instant meetings
- Real-time participant monitoring
- Auto-moderation features
- Camera and audio management

### Browser Bot
- Automated multipin functionality
- Visual monitoring capabilities
- Hand raise detection
- Compliance tracking

### Admin Features
- Session management
- Bot control
- User management
- System monitoring

## 🌐 Bilingual Support

The bot supports English and Spanish:

- Use `/language` to switch languages
- Automatic language detection
- Localized responses and help

## 🔒 Security Features

- OAuth-based authentication (no password storage)
- Admin-only commands protection
- Secure token handling
- Rate limiting support

## 🐛 Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check BOT_TOKEN in .env
   - Verify bot is started with correct token

2. **OAuth not working**
   - Verify ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET
   - Check redirect URI matches exactly
   - Ensure callback server is accessible

3. **Commands not working**
   - User must authorize with `/zoomlogin` first
   - Check if user has required permissions

### Debug Mode

Enable debug logging:

```bash
DEBUG=* node production-bot.js
```

## 📚 Documentation

- **Policy Documents**: https://pupfr.github.io/Nebulosa/
- **Setup Guides**: Available in repository
- **OAuth Guide**: Step-by-step authorization
- **API Reference**: Zoom API documentation

## 🚀 Deployment

### Heroku

1. Create new Heroku app
2. Set environment variables
3. Deploy code
4. Update ZOOM_REDIRECT_URI with Heroku URL

### Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### VPS/Server

1. Clone repository
2. Install dependencies
3. Configure environment
4. Start with PM2 or similar

## 📊 Monitoring

The bot includes built-in monitoring:

- Uptime tracking
- Memory usage
- Active user sessions
- Command usage statistics
- Error logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **GitHub**: Repository link
- **Telegram**: @YourBot
- **Support**: Contact information

---

**Ready to transform your Zoom meetings with powerful Telegram automation!** 🎉
