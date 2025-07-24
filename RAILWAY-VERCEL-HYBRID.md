# 🚀 HYBRID DEPLOYMENT: RAILWAY + VERCEL

## 🔗 **MULTI-PLATFORM STRATEGY**

**Railway Token**: `f116a0ab-8170-432d-a69a-f94f23d4a726`  
**Vercel Token**: `nIQ94iBPU8jZBmvlMqg4xmz8`

---

## 🎯 **DEPLOYMENT ARCHITECTURE**

### **🚂 Railway (Production Backend)**
- **Purpose**: Main bot server, OAuth processing, persistent connections
- **Features**: Always-on, multi-region V2, health monitoring
- **Cost**: $5-8/month
- **URL**: `https://nebulosa-production.railway.app`

### **▲ Vercel (Preview & API)**
- **Purpose**: Serverless functions, preview deployments, OAuth callbacks
- **Features**: Edge functions, instant scaling, zero cold start
- **Cost**: Free tier + usage
- **URL**: `https://nebulosa.vercel.app`

---

## 🔧 **HYBRID CONFIGURATION**

### **Railway Environment (Production)**
```env
# Railway Variables
BOT_TOKEN=your_telegram_bot_token
ZOOM_CLIENT_ID=vGVyI0IRv6si45iKO_qIw
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_SECRET_TOKEN=your_zoom_secret_token
ZOOM_REDIRECT_URI=https://nebulosa.vercel.app/auth/zoom/callback
VERCEL_WEBHOOK=https://nebulosa.vercel.app/api/bot
NODE_ENV=production
```

### **Vercel Environment (Preview)**
```env
# Vercel Environment Variables
BOT_TOKEN=@bot_token
ZOOM_CLIENT_ID=@zoom_client_id
ZOOM_CLIENT_SECRET=@zoom_client_secret
ZOOM_SECRET_TOKEN=@zoom_secret_token
ZOOM_REDIRECT_URI=https://nebulosa.vercel.app/auth/zoom/callback
RAILWAY_BACKEND=https://nebulosa-production.railway.app
NODE_ENV=production
```

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **Step 1: Deploy to Railway (Production)**
```bash
# Railway V2 deployment
git push origin main
# Railway auto-deploys with V2 config
```

### **Step 2: Deploy to Vercel (Preview/API)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login with token
vercel login
# Use token: nIQ94iBPU8jZBmvlMqg4xmz8

# Deploy to Vercel
vercel --prod
```

### **Step 3: Connect Environments**
```bash
# Set Vercel webhook in Railway
railway variables set VERCEL_WEBHOOK=https://nebulosa.vercel.app/api/bot

# Set Railway backend in Vercel
vercel env add RAILWAY_BACKEND
# Value: https://nebulosa-production.railway.app
```

---

## 🔄 **TRAFFIC ROUTING**

### **Production Flow**:
1. **Telegram → Railway**: Main bot processing
2. **OAuth → Vercel → Railway**: Callback handling
3. **Health Checks → Both**: Redundant monitoring

### **Preview Flow**:
1. **Telegram → Vercel**: Serverless processing
2. **Vercel → Railway**: Complex operations
3. **Fallback → Vercel**: If Railway down

---

## 💰 **COST COMPARISON**

| Platform | Railway | Vercel | Hybrid |
|----------|---------|--------|--------|
| **Base Cost** | $5-8/month | Free-$20/month | $5-8/month |
| **Serverless** | No | Yes | Best of both |
| **Always-On** | Yes | No | Yes (Railway) |
| **Edge Functions** | No | Yes | Yes (Vercel) |
| **Preview Deploys** | No | Yes | Yes |

**Hybrid Advantage**: Production reliability + Preview flexibility!

---

## 🎯 **DEPLOYMENT COMMANDS**

### **Automated Deployment Script**
```bash
#!/bin/bash
echo "🚀 Hybrid Deployment: Railway + Vercel"

# Deploy to Railway
echo "🚂 Deploying to Railway..."
git push origin main

# Deploy to Vercel  
echo "▲ Deploying to Vercel..."
vercel --prod --token nIQ94iBPU8jZBmvlMqg4xmz8

echo "✅ Hybrid deployment complete!"
echo "🚂 Railway: https://nebulosa-production.railway.app"
echo "▲ Vercel: https://nebulosa.vercel.app"
```

### **Environment Sync**
```bash
# Sync Railway to Vercel
railway variables | vercel env add --stdin

# Update OAuth callback
railway variables set ZOOM_REDIRECT_URI=https://nebulosa.vercel.app/auth/zoom/callback
```

---

## 📊 **MONITORING SETUP**

### **Health Check Endpoints**:
- **Railway**: `https://nebulosa-production.railway.app/health`
- **Vercel**: `https://nebulosa.vercel.app/health`
- **Combined**: Both platforms reporting status

### **Metrics Dashboard**:
```json
{
  "overall": "healthy",
  "vercel": {
    "status": "healthy",
    "platform": "vercel",
    "responseTime": "50ms"
  },
  "railway": {
    "status": "healthy", 
    "latency": "25ms",
    "uptime": "99.9%"
  },
  "deployment": {
    "strategy": "hybrid",
    "production": "railway",
    "preview": "vercel"
  }
}
```

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **Local Development**:
```bash
# Start Railway backend
npm run start

# Start Vercel preview
vercel dev
```

### **Preview Deployments**:
```bash
# Push to branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Vercel auto-creates preview
# URL: https://nebulosa-git-feature-new-feature.vercel.app
```

### **Production Deployment**:
```bash
# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Both platforms auto-deploy!
```

---

## 🎉 **HYBRID ADVANTAGES**

### **✅ Best of Both Worlds**:
- **Railway**: Persistent connections, always-on reliability
- **Vercel**: Serverless scaling, instant previews
- **Combined**: Production stability + development agility

### **🚀 Performance Benefits**:
- **Edge Functions**: Faster OAuth callbacks
- **Global CDN**: Worldwide performance
- **Auto-Scaling**: Handle traffic spikes
- **Zero Downtime**: Redundant infrastructure

### **💰 Cost Optimization**:
- **Railway**: Fixed cost for core functionality
- **Vercel**: Usage-based serverless scaling
- **Hybrid**: Optimize costs across platforms

---

## 🎯 **DEPLOYMENT STATUS**

### **✅ Files Created**:
- `api/bot.js` - Vercel serverless bot function
- `api/oauth.js` - Vercel OAuth callback handler  
- `api/health.js` - Vercel health check endpoint
- `vercel.json` - Hybrid deployment configuration

### **🚀 Ready to Deploy**:
1. **Railway**: V2 production backend ✅
2. **Vercel**: Serverless API functions ✅
3. **OAuth**: Cross-platform callback handling ✅
4. **Monitoring**: Dual health checks ✅

---

## 🚂▲ **DEPLOY BOTH PLATFORMS NOW!**

```bash
# Railway (Production)
git push origin main

# Vercel (Preview + API)
vercel --prod --token nIQ94iBPU8jZBmvlMqg4xmz8
```

**Your bot will run on both platforms with automatic failover and preview deployments!** 🎉

---

*Hybrid Deployment Strategy*  
*Railway: Production Backend*  
*Vercel: Serverless API*  
*Best of Both Worlds!* 🌍
