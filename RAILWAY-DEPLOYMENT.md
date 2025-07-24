# Zoom Telegram Bot - Railway Deployment

## Railway.app Configuration

### package.json
```json
{
  "name": "zoom-telegram-bot",
  "version": "1.0.0",
  "description": "Telegram bot for Zoom meeting management with OAuth integration",
  "main": "production-bot.js",
  "scripts": {
    "start": "node production-bot.js",
    "dev": "node basic-bot-implementation.js",
    "test": "node basic-bot-implementation.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.64.0",
    "axios": "^1.6.0",
    "express": "^4.18.0",
    "dotenv": "^16.3.0"
  }
}
```

### railway.json
Railway automatically detects Node.js projects, but you can customize:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node production-bot.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Environment Variables (Railway Dashboard)

Set these in Railway's Variables tab:

```env
BOT_TOKEN=your_telegram_bot_token
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_SECRET_TOKEN=your_zoom_secret_token
ZOOM_REDIRECT_URI=https://your-app.railway.app/auth/zoom/callback
PORT=3000
```

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Railway deployment ready"
   git push origin main
   ```

2. **Railway Setup**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js!

3. **Configure Environment**
   - Go to Variables tab
   - Add all environment variables
   - Railway will redeploy automatically

4. **Get Your URL**
   - Railway provides: `https://your-app.railway.app`
   - Update `ZOOM_REDIRECT_URI` with this URL

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Cost Comparison

| Platform | Free Tier | Paid Plan | Features |
|----------|-----------|-----------|----------|
| **Railway** | $5 credit/month | $5/month | 8GB RAM, auto-scale |
| Heroku | Limited hours | $7/month | 512MB RAM |
| Render | 750 hours | $7/month | 512MB RAM |
| Vercel | Function limits | $20/month | Serverless only |

## Railway Advantages

✅ **Cost Effective**: $5/month with $5 free credit  
✅ **Auto-scaling**: Handles traffic spikes  
✅ **Git Integration**: Deploy on push  
✅ **Custom Domains**: Free HTTPS  
✅ **Environment Management**: Easy variable setup  
✅ **Monitoring**: Built-in metrics  
✅ **Zero Config**: Detects Node.js automatically  

## Monitoring Your Bot

Railway provides:
- Real-time logs
- CPU/Memory usage
- Network metrics
- Deployment history
- Error tracking

## Custom Domain (Optional)

1. Go to Settings tab in Railway
2. Add your custom domain
3. Update DNS records
4. Railway handles SSL automatically

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check `package.json` is in root
   - Verify Node.js version compatibility
   - Check build logs in Railway

2. **Bot Not Responding**
   - Verify `BOT_TOKEN` in variables
   - Check service is running in Railway logs
   - Test with `/start` command

3. **OAuth Not Working**
   - Update `ZOOM_REDIRECT_URI` with Railway URL
   - Verify all Zoom credentials
   - Check callback endpoint accessibility

### Debug Commands:

```bash
# Check Railway logs
railway logs

# Connect to deployed service
railway shell

# View environment variables
railway variables
```

## Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update bot features"
git push origin main
# Railway deploys automatically!
```

## Scaling

Railway auto-scales based on usage:
- Scales down during idle periods
- Scales up during high usage
- Pay only for what you use

## Security

Railway provides:
- Automatic HTTPS
- Environment variable encryption
- Private networking
- Git-based deployments

---

## 🚀 Ready to Deploy!

1. Run: `./deploy-railway.sh` for complete guide
2. Push code to GitHub
3. Connect Railway to repository  
4. Set environment variables
5. Bot goes live automatically!

**Your Railway URL**: `https://your-app.railway.app`  
**Callback URL**: `https://your-app.railway.app/auth/zoom/callback`

Railway is the perfect balance of cost, features, and simplicity for your Telegram bot! 🎉
