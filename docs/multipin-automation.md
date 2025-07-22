# Multipin Puppeteer Automation

## Overview

The LA NUBE BOT now includes powerful browser automation for automatic multipin management in Zoom meetings using Puppeteer. This feature provides seamless multipin control based on participant camera status and hand-raise requirements.

## Features

### 🎯 Core Multipin System
- **Camera + Hand Raise Required**: Users must have camera ON AND hand raised to receive multipin access
- **60-Second Timer**: Automatic unpin after 60 seconds of camera being OFF
- **Instant Restoration**: Camera ON + hand raised = immediate multipin restoration
- **Real-time Monitoring**: Continuous participant status tracking

### 🤖 Browser Bot Automation
- **Headless Browser**: Runs Puppeteer in headless mode for performance
- **Multiple Selectors**: Robust element detection with fallback selectors
- **Error Handling**: Comprehensive error recovery and logging
- **Observatory Integration**: Complete action logging to NEBULOSO'S OBSERVATORY

## Commands

### `/startbot [MEETING_ID] [ZOOM_LINK]`
Start browser bot for automatic multipin management.

**Example:**
```
/startbot 123456789 https://zoom.us/j/123456789
```

**Features:**
- ✅ Automatic multipin for camera ON + hand raised
- ⏰ Auto-unpin after 60s without camera  
- 🔄 Continuous real-time monitoring
- 📝 Complete Observatory logging
- 🤖 Headless browser with Puppeteer

### `/stopbot [MEETING_ID]`
Stop browser bot automation for a specific meeting.

**Example:**
```
/stopbot 123456789
```

### `/botstatus`
View status of all active browser bots.

Shows:
- Active bot count
- Meeting IDs
- Bot status (Active/Error)
- Multipinned user count
- Connection status

## Auto-Start Integration

### Create Room Auto-Start
When using `/createroom`, a browser bot is automatically started for the new meeting:

```
/createroom Team Meeting
```

This will:
1. Create an instant Zoom meeting
2. Automatically start browser bot for multipin automation
3. Begin monitoring participants immediately

## Technical Implementation

### Browser Bot Architecture
```javascript
class ZoomBrowserBot {
  constructor(meetingData, userToken = null)
  async start()                    // Launch browser and join meeting
  async multipinUser(userName)     // Execute multipin action
  async unpinUser(userName)        // Execute unpin action
  async cleanup()                  // Close browser and cleanup
}
```

### Integration Points
- **manageMultipinAccess()**: Core logic enhanced with browser bot execution
- **Monitor System**: Automatic browser bot actions during monitoring
- **Observatory Logging**: All actions logged with detailed information

### Error Handling
- Multiple selector fallbacks for robust element detection
- Graceful degradation when browser bot unavailable
- Comprehensive error logging and recovery

## Requirements

### System Requirements
- Node.js with Puppeteer support
- Sufficient system resources for headless browser
- Administrator permissions in Telegram bot
- Active Zoom account with OAuth connection

### Dependencies
```json
{
  "puppeteer": "^21.0.0"
}
```

## Usage Workflow

### 1. Basic Setup
```bash
# Install dependencies
npm install

# Start the bot
node bot.cjs
```

### 2. Create Meeting with Auto-Multipin
```
/createroom Important Meeting
```
- Creates meeting instantly
- Browser bot starts automatically
- Multipin automation begins immediately

### 3. Manual Browser Bot Management
```
# Start browser bot for existing meeting
/startbot 123456789 https://zoom.us/j/123456789

# Check status
/botstatus

# Stop specific bot
/stopbot 123456789
```

### 4. Monitor Integration
```
/monitor 123456789
```
- Starts automatic participant monitoring
- Browser bot executes multipin/unpin actions
- Real-time processing every 30 seconds

## Multipin Logic Flow

```
1. Participant joins meeting
2. Monitor detects camera ON + hand raised
3. manageMultipinAccess() grants access
4. executeMultipinAction() calls browser bot
5. Browser bot executes actual multipin
6. Success/failure logged to Observatory
7. User receives confirmation message

Camera goes OFF:
1. 60-second timer starts
2. After timeout: browser bot unpins user
3. User notified of expiration
4. Must raise hand again to regain access
```

## Logging and Monitoring

### Observatory Integration
All browser bot actions are logged to NEBULOSO'S OBSERVATORY:

```
🤖 BROWSER BOT STARTED
🆔 Meeting: 123456789
🎯 Multipin automation: ACTIVE

🎛️ MULTIPIN ACTION  
👤 User: JohnDoe
🎯 Action: PIN
📊 Result: MULTIPIN_GRANTED

🔚 BROWSER BOT STOPPED
🎯 Multipin automation: DEACTIVATED
```

### Command Chat Notifications
Critical events notify the Command Chat:
- Browser bot start/stop
- Auto-start successes/failures  
- Error conditions requiring attention

## Best Practices

### 1. Resource Management
- Browser bots automatically cleanup on shutdown
- Use `/botstatus` to monitor active bots
- Stop unused bots to free resources

### 2. Meeting Management
- Start browser bot early in meeting lifecycle
- Ensure cohost permissions for maximum functionality
- Monitor Observatory logs for issues

### 3. Error Recovery
- Browser bots auto-restart on certain errors
- Fallback to API-only mode if browser fails
- Manual restart available via commands

## Troubleshooting

### Common Issues

**Browser Bot Won't Start**
- Check system resources and Puppeteer installation
- Verify Zoom meeting URL is valid and accessible
- Ensure user has proper permissions

**Multipin Actions Fail**
- Zoom interface may have changed selectors
- Browser bot may need cohost promotion
- Check Observatory logs for specific errors

**Performance Issues**  
- Multiple browser bots consume significant resources
- Consider limiting concurrent bots
- Monitor system resource usage

### Debug Mode
For development, change headless mode in zoomBrowserBot.js:
```javascript
headless: false  // Shows browser window for debugging
```

## Future Enhancements

- **Intelligent Selector Learning**: Dynamic adaptation to Zoom UI changes
- **Batch Operations**: Simultaneous multipin for multiple users
- **Advanced Analytics**: Detailed multipin usage statistics
- **Mobile Support**: Enhanced mobile browser compatibility
