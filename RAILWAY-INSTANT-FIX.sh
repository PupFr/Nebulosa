#!/bin/bash

# 🚨 RAILWAY INSTANT FIX - OAuth 404 Error Solution
# ================================================

echo "🚂 RAILWAY INSTANT FIX SCRIPT"
echo "============================="
echo ""

echo "❌ CURRENT PROBLEM:"
echo "   - Railway shows ASCII art instead of bot"
echo "   - OAuth callback returns 404"
echo "   - Wrong service is running"
echo ""

echo "🔍 STEP 1: DIAGNOSTIC TEST"
echo "=========================="

echo "Testing current Railway endpoints..."

echo "1. Root endpoint test:"
ROOT_RESPONSE=$(curl -s https://nebulosa-production.railway.app/ | head -1)
if [[ "$ROOT_RESPONSE" == *"status"* ]]; then
    echo "   ✅ Bot is running correctly"
else
    echo "   ❌ Wrong service running (shows: $ROOT_RESPONSE)"
fi

echo ""
echo "2. OAuth callback test:"
OAUTH_RESPONSE=$(curl -s https://nebulosa-production.railway.app/auth/zoom/callback)
if [[ "$OAUTH_RESPONSE" == *"Authorization"* ]]; then
    echo "   ✅ OAuth endpoint working"
else
    echo "   ❌ OAuth endpoint not found (404)"
fi

echo ""
echo "3. Health check test:"
HEALTH_RESPONSE=$(curl -s https://nebulosa-production.railway.app/health)
echo "   Response: $HEALTH_RESPONSE"

echo ""
echo "🔧 STEP 2: SOLUTION STEPS"
echo "========================"

echo "TO FIX RAILWAY DEPLOYMENT:"
echo ""
echo "1. 🌐 GO TO RAILWAY DASHBOARD:"
echo "   → Open: https://railway.app/dashboard"
echo "   → Find: 'nebulosa-production' service"
echo ""

echo "2. ⚙️ CHECK START COMMAND:"
echo "   → Click your service"
echo "   → Go to 'Settings' → 'General'"
echo "   → Verify 'Start Command' is:"
echo "     node railway-bot-simple.js"
echo ""

echo "3. 📁 CHECK ROOT DIRECTORY:"
echo "   → In Settings, verify 'Root Directory' is: /"
echo "   → Should NOT be set to a subfolder"
echo ""

echo "4. 🚀 FORCE REDEPLOY:"
echo "   → Go to 'Deployments' tab"
echo "   → Click 'Deploy' button"
echo "   → Wait 1-2 minutes for completion"
echo ""

echo "5. ✅ VERIFY FIX:"
echo "   → Test: curl https://nebulosa-production.railway.app/"
echo "   → Should return JSON with 'status': 'healthy'"
echo ""

echo "🎯 STEP 3: OAUTH FIX AFTER RAILWAY WORKS"
echo "========================================"

echo "Once Railway is fixed:"
echo ""
echo "1. Add this URI to Zoom app settings:"
echo "   https://nebulosa-production.railway.app/auth/zoom/callback"
echo ""
echo "2. Test /zoomlogin in Telegram"
echo "   → Should work without 4.700 error"
echo ""

echo "⚡ QUICK VERIFICATION COMMANDS:"
echo "=============================="
echo ""
echo "# Test after Railway fix:"
echo "curl https://nebulosa-production.railway.app/"
echo "curl https://nebulosa-production.railway.app/auth/zoom/callback"
echo ""
echo "# Both should return proper responses, not 404 or ASCII art"
echo ""

echo "🏁 EXPECTED RESULTS:"
echo "==================="
echo "✅ Root endpoint: JSON health status"
echo "✅ OAuth callback: HTML page with 'No Authorization Code'"
echo "✅ /zoomlogin: Works in Telegram without errors"
echo ""

echo "🚨 IF RAILWAY DASHBOARD ACCESS NEEDED:"
echo "====================================="
echo "Railway CLI alternative fix:"
echo "railway login"
echo "railway link"
echo "railway deploy"
echo ""

echo "📞 FINAL NOTE:"
echo "=============="
echo "After Railway is fixed, your bot will be 100% operational!"
echo "The 4.700 OAuth error will disappear once the callback endpoint works."
