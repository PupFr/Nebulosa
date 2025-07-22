#!/bin/bash

# 🌐 Netlify Deployment - FREE with Serverless Functions
echo "🌐 DEPLOYING TO NETLIFY (FREE)"
echo "=============================="

# Install Netlify CLI if not present
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Create netlify.toml configuration
cat > netlify.toml << 'EOF'
[build]
  publish = "."
  command = "echo 'Static site - no build required'"

# Redirect rules for SPA-like behavior
[[redirects]]
  from = "/oauth"
  to = "/zoom-callback.html"
  status = 301

[[redirects]]
  from = "/auth"
  to = "/zoom-callback.html"
  status = 301

[[redirects]]
  from = "/docs"
  to = "/docs-index.html"
  status = 301

[[redirects]]
  from = "/setup"
  to = "/docs-setup.html"
  status = 301

[[redirects]]
  from = "/multipin"
  to = "/docs-multipin.html"
  status = 301

[[redirects]]
  from = "/shortio"
  to = "/docs-shortio.html"
  status = 301

# 404 handling
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache control
[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=86400"
EOF

# Create a simple serverless function for OAuth (optional)
mkdir -p netlify/functions
cat > netlify/functions/zoom-oauth.js << 'EOF'
exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters || {};
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing authorization code' })
    };
  }
  
  // For now, just return the code - you can implement full OAuth flow later
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Success - LA NUBE BOT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <h1>🎉 OAuth Authorization Successful!</h1>
    <p>Authorization code received: <code>${code}</code></p>
    <p><a href="/docs-index.html">← Back to Documentation</a></p>
    <script>
        // Store the code and redirect
        localStorage.setItem('zoom_oauth_code', '${code}');
        setTimeout(() => window.location.href = '/docs-oauth.html', 3000);
    </script>
</body>
</html>
    `
  };
};
EOF

echo "✅ Netlify configuration created"
echo ""
echo "🚀 Deploying to Netlify..."

# Login to Netlify (will open browser)
netlify login

# Deploy the site
netlify deploy --prod --dir . --message "Deploy LA NUBE BOT documentation"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "🌐 Your site is now live at:"
netlify status | grep "Website URL" | awk '{print $3}'
echo ""
echo "💡 To set custom domain:"
echo "1. Go to Netlify dashboard"
echo "2. Site settings → Domain management" 
echo "3. Add custom domain: pupfrisky.com"
echo "4. Configure DNS as instructed"
echo ""
echo "🔧 OAuth endpoint available at:"
echo "https://your-site.netlify.app/.netlify/functions/zoom-oauth"
