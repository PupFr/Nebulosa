# GitHub OAuth Bypass Setup for PupFr/Nebulosa

## Overview
Using your existing GitHub repository `https://github.com/PupFr/Nebulosa` to host a static OAuth callback page that redirects to your Replit app.

## Setup Steps

### 1. Repository Already Exists ✅
Repository: `https://github.com/PupFr/Nebulosa`

### 2. Upload OAuth Callback File
Upload the `github-oauth-callback.html` content as `index.html` to your repository root.

### 3. Enable GitHub Pages
1. Go to https://github.com/PupFr/Nebulosa/settings/pages
2. Source: Deploy from a branch
3. Branch: main (or master)
4. Folder: / (root)
5. Save

### 4. Your GitHub Pages URL
Your callback URL will be:
```
https://pupfr.github.io/Nebulosa/
```

### 5. Update Zoom App Settings
1. Go to https://marketplace.zoom.us/develop/apps
2. Select your app (Client ID: K3t8Sd3rSZOSKfkyMftDXg)
3. Update OAuth Redirect URL to:
   ```
   https://pupfr.github.io/Nebulosa/
   ```
4. Also add to OAuth Allow List
5. Save changes

### 6. Set Environment Variable
Set the GITHUB_OAUTH_CALLBACK environment variable to:
```
https://pupfr.github.io/Nebulosa/
```

The bot is already configured to use this URL.

## How It Works

1. User clicks Zoom OAuth link (points to GitHub Pages)
2. Zoom redirects to GitHub Pages with OAuth code
3. GitHub Pages JavaScript automatically redirects to Replit with the code
4. Replit processes the OAuth code normally

## Benefits

- ✅ Static domain (no dynamic domain issues)
- ✅ Free hosting on GitHub Pages  
- ✅ Professional domain appearance
- ✅ No external services needed
- ✅ Works with Zoom's strict OAuth validation

## Testing

1. Generate OAuth URL with GitHub Pages redirect
2. Click the link
3. Authorize with Zoom
4. Should redirect through GitHub Pages to Replit
5. Bot should receive OAuth code successfully

This bypasses the error 4700 issue completely while maintaining professional appearance.