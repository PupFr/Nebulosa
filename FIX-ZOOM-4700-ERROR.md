# 🚨 URGENT FIX: Error 4.700 - Redirección no válida

## ❌ **CURRENT ERROR:**
```
Redirección no válida: https://nebulosa-production.railway.app/auth/zoom/callback (4.700)
```

## ✅ **IMMEDIATE SOLUTION:**

### **STEP 1: Open Zoom Marketplace**
1. Go to: **https://marketplace.zoom.us/develop/apps**
2. Sign in with your Zoom account

### **STEP 2: Find Your App**
1. Look for your app with Client ID: **`vGVyI0IRv6si45iKO_qIw`**
2. Click on the app to edit it

### **STEP 3: Add Railway Callback**
1. Click **"OAuth"** section
2. Find **"Redirect URL for OAuth"** field
3. **ADD THIS EXACT URL**:
   ```
   https://nebulosa-production.railway.app/auth/zoom/callback
   ```
4. Click **"Save"** or **"Update"**

### **STEP 4: Test Immediately**
1. Wait 30 seconds for changes to propagate
2. Go to Telegram and send `/zoomlogin` to @La_NUBE_bot
3. Click the authorization link
4. Should work without error 4.700!

## 🔍 **VERIFICATION:**

### **What Should Happen After Fix:**
1. `/zoomlogin` generates OAuth URL ✅
2. Click link → Zoom login page (no error) ✅
3. Authorize app → Success page ✅
4. Return to Telegram → Ready for `/create_meeting` ✅

### **Test the Callback Endpoint:**
```bash
curl https://nebulosa-production.railway.app/auth/zoom/callback
# Should return HTML page, not 404
```

## 📋 **SCREENSHOT GUIDE:**

### **In Zoom App Settings:**
```
OAuth Section:
┌─────────────────────────────────────────────────────────┐
│ Redirect URL for OAuth:                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ https://nebulosa-production.railway.app/auth/zoom/  │ │
│ │ callback                                            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [+ Add Another URL]                                     │
│                                                         │
│ [Save Changes]                                          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 **EXPECTED RESULT:**

### **Before Fix:**
- Click `/zoomlogin` link → **ERROR 4.700** ❌
- "Redirección no válida" message ❌

### **After Fix:**
- Click `/zoomlogin` link → **Zoom login page** ✅
- Authorize → **Success page** ✅
- OAuth flow complete ✅

---

**⚡ CRITICAL: You MUST add the Railway callback URL to your Zoom app for `/zoomlogin` to work!**
