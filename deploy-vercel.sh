#!/bin/bash

# ⚡ Vercel Deployment - FREE with Edge Functions
echo "⚡ DEPLOYING TO VERCEL (FREE)"
echo "============================"

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Create vercel.json configuration
cat > vercel.json << 'EOF'
{
  "version": 2,
  "public": true,
  "buildCommand": "echo 'Static site ready'",
  "outputDirectory": ".",
  "routes": [
    {
      "src": "/oauth",
      "dest": "/zoom-callback.html"
    },
    {
      "src": "/auth", 
      "dest": "/zoom-callback.html"
    },
    {
      "src": "/docs",
      "dest": "/docs-index.html"
    },
    {
      "src": "/setup",
      "dest": "/docs-setup.html"
    },
    {
      "src": "/multipin",
      "dest": "/docs-multipin.html"
    },
    {
      "src": "/shortio",
      "dest": "/docs-shortio.html"
    },
    {
      "src": "/(.*)",
      "dest": "/404.html",
      "status": 404
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection", 
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    },
    {
      "source": "**/*.svg",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }
      ]
    }
  ]
}
EOF

# Create a simple API route for OAuth
mkdir -p api
cat > api/zoom-oauth.js << 'EOF'
export default function handler(req, res) {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }
  
  // Return HTML response
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Success - LA NUBE BOT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: system-ui; text-align: center; padding: 50px; }
        .success { color: #22c55e; font-size: 2em; }
        code { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="success">🎉 OAuth Authorization Successful!</div>
    <p>Authorization code received:</p>
    <code>${code}</code>
    <p><a href="/docs-index.html">← Back to Documentation</a></p>
    <script>
        localStorage.setItem('zoom_oauth_code', '${code}');
        setTimeout(() => window.location.href = '/docs-oauth.html', 3000);
    </script>
</body>
</html>
  `);
}
EOF

echo "✅ Vercel configuration created"
echo ""
echo "🚀 Deploying to Vercel..."

# Login and deploy
vercel login
vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "🌐 Your site is now live at:"
vercel ls | grep "https://" | head -1
echo ""
echo "💡 To set custom domain:"
echo "1. Go to Vercel dashboard"
echo "2. Project settings → Domains"
echo "3. Add domain: pupfrisky.com" 
echo "4. Configure DNS as instructed"
echo ""
echo "🔧 OAuth endpoint available at:"
echo "https://your-project.vercel.app/api/zoom-oauth"
