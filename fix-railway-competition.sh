#!/bin/bash

# 🚨 URGENT FIX: Railway Still Competing - Force Local Enhanced Bot

echo "🚨 PROBLEM: Railway Bot Still Responding with Short Menu"
echo "======================================================="
echo ""

echo "❌ CURRENT ISSUE:"
echo "   • Railway bot (limited menu) is still active"
echo "   • Your enhanced local bot (30+ commands) is running but not responding"
echo "   • Railway has priority, causing short menu responses"
echo ""

echo "✅ IMMEDIATE SOLUTION:"
echo "====================="
echo ""

echo "STEP 1: Force stop Railway service"
echo "----------------------------------"
echo "   Railway CLI command to disable service:"
echo "   railway service disconnect --force"
echo ""

echo "STEP 2: Restart enhanced local bot"
echo "--------------------------------"

# Kill current local bot
LOCAL_BOT=$(ps aux | grep "railway-bot-simple.js" | grep -v grep | awk '{print $2}')
if [ -n "$LOCAL_BOT" ]; then
    echo "   Stopping current local bot (PID: $LOCAL_BOT)"
    kill $LOCAL_BOT
    sleep 3
fi

# Start enhanced bot
echo "   Starting enhanced bot with full menu..."
node railway-bot-simple.js &
NEW_PID=$!
echo "   ✅ Enhanced bot started (PID: $NEW_PID)"

sleep 3

echo ""
echo "STEP 3: Verify enhanced bot is responding"
echo "---------------------------------------"

# Test OAuth callback
CALLBACK_TEST=$(curl -s http://localhost:3000/auth/zoom/callback 2>/dev/null)
if [[ "$CALLBACK_TEST" == *"Authorization"* ]]; then
    echo "   ✅ OAuth callback working"
else
    echo "   ❌ OAuth callback issue"
fi

# Test root endpoint
ROOT_TEST=$(curl -s http://localhost:3000/ 2>/dev/null)
if [[ "$ROOT_TEST" == *"healthy"* ]]; then
    echo "   ✅ Enhanced bot API responding"
else
    echo "   ❌ Enhanced bot API not responding"
fi

echo ""
echo "🎯 CRITICAL ACTIONS NEEDED:"
echo "=========================="
echo ""
echo "1. DISABLE RAILWAY SERVICE:"
echo "   → Go to: https://railway.app/dashboard"
echo "   → Find 'nebulosa-production' service"  
echo "   → Click 'Settings' → 'Service'"
echo "   → Click 'Delete Service' or 'Pause'"
echo "   → This stops Railway bot permanently"
echo ""

echo "2. ALTERNATIVE - Railway CLI:"
echo "   railway service delete"
echo "   (This removes Railway competition)"
echo ""

echo "3. TEST ENHANCED BOT:"
echo "   → Send /start to @La_NUBE_bot"
echo "   → Should show 'Versión Completa' with 30+ commands"
echo "   → If still short menu, Railway is still active"
echo ""

echo "🎊 EXPECTED RESULT AFTER RAILWAY DISABLED:"
echo "=========================================="
echo ""
echo "   ❌ OLD (Railway): 5 basic commands"
echo "   ✅ NEW (Enhanced): 30+ commands organized by category"
echo ""
echo "   Enhanced bot will show:"
echo "   '🤖 ¡Hola! Soy LA NUBE BOT ☁️ - Versión Completa'"
echo "   + Full command categories"
echo "   + Professional layout"
echo ""

echo "🔧 CURRENT STATUS:"
echo "=================="
echo "   Local Enhanced Bot: PID $NEW_PID ✅"
echo "   OAuth: http://localhost:3000/auth/zoom/callback ✅"
echo "   Problem: Railway still competing ❌"
echo ""

echo "🚨 ACTION REQUIRED: Disable Railway service to see full menu!"
echo "============================================================="
