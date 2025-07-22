# Zoom Co-Host Automation Bot

This directory contains the Zoom Co-Host automation bot that automatically joins meetings using OAuth, requests co-host privileges, and manages multipin functionality for participants who raise their hands.

## Files

### `zoom_cohost_bot.js`
Main automation logic that:
- Uses OAuth authentication to join meetings (no manual login)
- Automatically requests co-host status from meeting host
- Monitors participant list every 10 seconds
- Multipins non-host/co-host participants who raise their hands
- Unpins participants when they lower their hands
- Provides comprehensive logging and error handling

### `zoom_oauth_utils.js`
OAuth utility functions for token management:
- **STUB implementations** - Users must implement actual OAuth logic
- Token retrieval and storage functions
- Token validation and refresh capabilities
- Authorization URL generation
- Code exchange for access tokens

### `example_usage.js`
Demonstrates how to use the co-host bot with proper setup instructions and error handling.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install puppeteer
   ```

2. **Set Up OAuth** (Required - implement in `zoom_oauth_utils.js`)
   - Create Zoom OAuth app with scopes: `meeting:write`, `meeting:read`, `user:read`
   - Implement token storage (database, environment variables, etc.)
   - Set up OAuth callback endpoint
   - Configure environment variables

3. **Run OAuth Authentication**
   ```javascript
   const { getAuthorizationUrl, exchangeCodeForToken } = require('./zoom_oauth_utils');
   
   // Generate auth URL
   const authUrl = getAuthorizationUrl();
   // Direct user to authUrl, handle callback, exchange code for token
   ```

4. **Run the Bot**
   ```javascript
   const { ZoomCohostBot } = require('./zoom_cohost_bot');
   
   const bot = new ZoomCohostBot('https://zoom.us/j/your-meeting');
   await bot.start();
   ```

## Environment Variables

Set these in your `.env` file or environment:

```bash
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret  
ZOOM_REDIRECT_URI=your_oauth_callback_url
```

## Features

### OAuth Authentication
- No manual login required
- Uses OAuth tokens for authenticated API access
- Automatic token refresh when expired
- Secure token storage (implement in utils)

### Co-host Management  
- Automatically detects co-host status
- Sends polite chat request if not co-host
- Waits up to 5 minutes for promotion
- Continues monitoring even without co-host

### Participant Monitoring
- Scans participant list every 10 seconds
- Detects hand raise/lower events
- Tracks host/co-host status to avoid pinning them
- Handles participant join/leave events

### Multipin Automation
- Automatically pins users who raise hands
- Only pins non-host/co-host participants
- Unpins when hands are lowered
- Robust error handling for UI interactions

### Logging & Monitoring
- Comprehensive console logging with emojis
- Real-time status reporting
- Error handling and recovery
- Performance tracking

## Selector Management

The bot uses CSS selectors defined in `ZOOM_SELECTORS` to interact with Zoom's web interface. These may need updates when Zoom changes their UI.

**To update selectors when they break:**

1. Set `headless: false` in `launchBrowser()` for visual debugging
2. Use browser dev tools to find new element selectors  
3. Update the `ZOOM_SELECTORS` object
4. Priority: `data-testid` > `aria-label` > class names > text content

### Critical Selectors

| Purpose | Current Selector | Update When |
|---------|------------------|-------------|
| Join Button | `button:has-text("Join")` | Join process fails |
| Participants Panel | `.participants-panel` | Can't find participants |
| Hand Raised | `.hand-raised` | Hand detection fails |
| Co-host Indicator | `.cohost-indicator` | Status detection fails |
| Pin Option | `li:has-text("Pin")` | Pinning fails |

## Error Handling

The bot includes comprehensive error handling:

- **Network Issues**: Retries with exponential backoff
- **Selector Failures**: Multiple selector fallbacks  
- **OAuth Expiration**: Automatic token refresh
- **Meeting Disconnection**: Graceful cleanup and reconnection
- **Permission Errors**: Clear user guidance

## Security Considerations

⚠️ **Important Security Notes:**

- Never store OAuth tokens in plain text
- Use environment variables or encrypted storage
- Implement proper token expiration handling
- Use HTTPS for all OAuth callbacks
- Validate all user inputs
- Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **"Puppeteer not installed"**
   ```bash
   npm install puppeteer
   ```

2. **"OAuth token required"**  
   - Implement OAuth functions in `zoom_oauth_utils.js`
   - Complete OAuth flow to get initial tokens

3. **"Selectors not working"**
   - Update `ZOOM_SELECTORS` for current Zoom UI
   - Check browser console for errors

4. **"Can't find participants"**
   - Ensure participants panel is open
   - Check if meeting requires waiting room admission

5. **"Co-host request ignored"**
   - Verify chat permissions in meeting
   - Check if host has co-host promotion disabled

### Debug Mode

Enable visual debugging:

```javascript
// In launchBrowser() method
headless: false  // Change from true to false
```

This opens a visible browser window to see exactly what the bot is doing.

## Limitations

- Requires stable internet connection
- Depends on Zoom web interface (subject to changes)
- OAuth token must have proper meeting control scopes
- May not work with heavily restricted meeting settings
- Performance depends on meeting size and browser resources

## Contributing

When contributing to this bot:

1. Test with multiple Zoom meeting configurations
2. Update selectors if UI changes are detected
3. Add comprehensive error handling for new features
4. Document any new environment variables or setup steps
5. Ensure OAuth implementations are secure

## License

Part of the Nebulosa project - see main LICENSE file.