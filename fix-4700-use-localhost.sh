#!/bin/bash

# 🚨 IMMEDIATE FIX: Use Localhost Instead of Railway

echo "🚨 4.700 ERROR DETECTED: Using Railway URL"
echo "=========================================="
echo ""
echo "❌ CURRENT PROBLEM:"
echo "   You're testing: https://nebulosa-production.railway.app/auth/zoom/callback"
echo "   Result: 4.700 error (Railway OAuth not configured in Zoom)"
echo ""

echo "✅ IMMEDIATE SOLUTION:"
echo "====================="
echo ""

echo "STEP 1: Verify localhost bot is running"
echo "---------------------------------------"
BOT_PID=$(ps aux | grep "node railway-bot-simple.js" | grep -v grep | awk '{print $2}')
if [ -n "$BOT_PID" ]; then
    echo "   ✅ Local bot running (PID: $BOT_PID)"
else
    echo "   ❌ Local bot not running - starting it..."
    node railway-bot-simple.js &
    sleep 2
    echo "   ✅ Bot started"
fi

echo ""
echo "STEP 2: Test localhost OAuth callback"
echo "------------------------------------"
CALLBACK_TEST=$(curl -s http://localhost:3000/auth/zoom/callback 2>/dev/null)
if [[ "$CALLBACK_TEST" == *"Authorization"* ]]; then
    echo "   ✅ Localhost OAuth callback working!"
else
    echo "   ❌ Localhost OAuth callback failed"
    echo "   Response: $CALLBACK_TEST"
fi

echo ""
echo "STEP 3: Add localhost URI to Zoom app"
echo "------------------------------------"
echo "   🔗 GO TO: https://marketplace.zoom.us/develop/apps"
echo "   📋 FIND: Client ID vGVyI0IRv6si45iKO_qIw"
echo "   ➕ ADD THIS URI:"
echo "      http://localhost:3000/auth/zoom/callback"
echo "   💾 SAVE CHANGES"
echo ""

echo "STEP 4: Test localhost OAuth URL"
echo "-------------------------------"
echo "   🧪 USE THIS URL IN BROWSER:"
echo "   https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread%20meeting%3Awrite%20user%3Aread&state=test123"
echo ""

echo "STEP 5: Test via Telegram"
echo "------------------------"
echo "   📱 Send /zoomlogin to @La_NUBE_bot"
echo "   🔗 Click the authorization link"
echo "   ✅ Should work without 4.700 error!"
echo ""

echo "🎯 KEY DIFFERENCE:"
echo "=================="
echo "   ❌ Railway: https://nebulosa-production.railway.app/auth/zoom/callback"
echo "   ✅ Localhost: http://localhost:3000/auth/zoom/callback"
echo ""
echo "   Railway URL causes 4.700 because it's not in Zoom app settings"
echo "   Localhost URL will work once you add it to Zoom app"
echo ""

echo "⚡ IMMEDIATE ACTION:"
echo "=================="
echo "   1. Add localhost URI to Zoom app"
echo "   2. Test the localhost OAuth URL above"
echo "   3. Should work perfectly!"
echo ""

echo "🎊 EXPECTED RESULT:"
echo "=================="
echo "   → No more 4.700 errors"
echo "   → OAuth flow completes successfully"
echo "   → Redirect to localhost success page"
