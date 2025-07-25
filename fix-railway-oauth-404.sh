#!/bin/bash

# 🚨 URGENT: Fix Railway OAuth Callback 404 Error

echo "🚂 Railway OAuth Callback Fix - Deployment Script"
echo "=================================================="

echo "❌ CURRENT STATUS: OAuth callback returns 404"
echo "✅ EXPECTED: OAuth callback should return HTML page"
echo ""

echo "🔍 DIAGNOSTIC: Testing current Railway endpoints..."

echo "1. Health check:"
curl -s https://nebulosa-production.railway.app/health || echo "❌ Health check failed"

echo -e "\n2. Root endpoint:"
curl -s https://nebulosa-production.railway.app/ | head -5

echo -e "\n3. OAuth callback test:"
curl -s https://nebulosa-production.railway.app/auth/zoom/callback | head -5

echo -e "\n🚨 PROBLEM DETECTED: Railway is serving default API page, not our bot!"
echo ""

echo "💡 SOLUTION OPTIONS:"
echo "1. Force Railway deployment"
echo "2. Check Railway service configuration"
echo "3. Verify railway-bot-simple.js is the active service"
echo ""

echo "🔧 MANUAL FIX STEPS:"
echo "1. Go to Railway dashboard: https://railway.app/dashboard"
echo "2. Find 'nebulosa-production' service"
echo "3. Check if railway-bot-simple.js is set as main file"
echo "4. Trigger manual deployment if needed"
echo ""

echo "⚡ QUICK TEST: Once Railway is fixed, test with:"
echo "curl https://nebulosa-production.railway.app/auth/zoom/callback"
echo "Should return HTML page with 'No Authorization Code' message"
