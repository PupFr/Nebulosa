# Manual GitHub Pages OAuth Setup

## Step 1: Upload to GitHub Repository

1. Go to https://github.com/PupFr/Nebulosa
2. Click "Add file" → "Create new file"
3. Name the file: `index.html`
4. Copy and paste the ENTIRE content from `github-oauth-callback.html` below

## Step 2: Enable GitHub Pages

1. Go to https://github.com/PupFr/Nebulosa/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Branch: `main` (or `master` if that's your default)
4. Folder: `/ (root)`
5. Click "Save"

## Step 3: Update Zoom App Settings

1. Go to https://marketplace.zoom.us/develop/apps
2. Find your app with Client ID: `K3t8Sd3rSZOSKfkyMftDXg`
3. Go to the "OAuth" section
4. Update "OAuth Redirect URL" to: `https://pupfr.github.io/Nebulosa/`
5. Also add it to "OAuth Allow List" if that section exists
6. Save changes

## Step 4: Set Environment Variable

In your Replit secrets, add:
- Key: `GITHUB_OAUTH_CALLBACK`
- Value: `https://pupfr.github.io/Nebulosa/`

## Testing

After completing all steps:
1. Use the `/zoomlogin` command in your bot
2. Click the OAuth link
3. It should redirect through GitHub Pages to your Replit app
4. OAuth should complete successfully

This completely bypasses the error 4700 issue!