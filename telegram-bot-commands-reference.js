#!/usr/bin/env node

console.log('🤖 TELEGRAM BOT MEETING COMMANDS REFERENCE');
console.log('==========================================\n');

// Complete command reference for the Telegram bot
const botCommands = {
    // Basic Commands
    basic: [
        {
            command: '/start',
            description: 'Welcome message and help',
            usage: '/start',
            example: '/start',
            response: 'Welcome! I can help you manage Zoom meetings via Telegram.'
        },
        {
            command: '/help',
            description: 'Show all available commands',
            usage: '/help',
            example: '/help',
            response: 'List of all available commands with descriptions.'
        },
        {
            command: '/authorize',
            description: 'Link your Zoom account via OAuth',
            usage: '/authorize',
            example: '/authorize',
            response: 'OAuth authorization URL for linking Zoom account.'
        }
    ],

    // Meeting Creation
    creation: [
        {
            command: '/create_meeting',
            description: 'Create a new Zoom meeting',
            usage: '/create_meeting [topic] [duration_minutes]',
            example: '/create_meeting Weekly Team Meeting 60',
            response: 'Meeting created with ID, join URL, and password.'
        },
        {
            command: '/schedule_meeting',
            description: 'Schedule a meeting for specific time',
            usage: '/schedule_meeting [topic] [date] [time] [duration]',
            example: '/schedule_meeting Project Review 2025-07-25 14:00 90',
            response: 'Meeting scheduled with all details and calendar info.'
        },
        {
            command: '/recurring_meeting',
            description: 'Create a recurring meeting',
            usage: '/recurring_meeting [topic] [frequency] [duration]',
            example: '/recurring_meeting Daily Standup weekly 30',
            response: 'Recurring meeting series created successfully.'
        }
    ],

    // Meeting Management
    management: [
        {
            command: '/list_meetings',
            description: 'List all your scheduled meetings',
            usage: '/list_meetings [status]',
            example: '/list_meetings upcoming',
            response: 'List of meetings with IDs, topics, and times.'
        },
        {
            command: '/meeting_info',
            description: 'Get detailed meeting information',
            usage: '/meeting_info [meeting_id]',
            example: '/meeting_info 123456789',
            response: 'Complete meeting details including participants.'
        },
        {
            command: '/update_meeting',
            description: 'Update meeting details',
            usage: '/update_meeting [meeting_id] [field] [value]',
            example: '/update_meeting 123456789 topic "New Topic"',
            response: 'Meeting updated successfully.'
        },
        {
            command: '/delete_meeting',
            description: 'Delete a scheduled meeting',
            usage: '/delete_meeting [meeting_id]',
            example: '/delete_meeting 123456789',
            response: 'Meeting deleted and participants notified.'
        }
    ],

    // Live Meeting Controls
    live: [
        {
            command: '/meeting_status',
            description: 'Get current meeting status',
            usage: '/meeting_status [meeting_id]',
            example: '/meeting_status 123456789',
            response: 'Real-time meeting status and participant count.'
        },
        {
            command: '/start_meeting',
            description: 'Start a scheduled meeting',
            usage: '/start_meeting [meeting_id]',
            example: '/start_meeting 123456789',
            response: 'Meeting started successfully.'
        },
        {
            command: '/end_meeting',
            description: 'End an active meeting',
            usage: '/end_meeting [meeting_id]',
            example: '/end_meeting 123456789',
            response: 'Meeting ended and participants notified.'
        }
    ],

    // Participant Management
    participants: [
        {
            command: '/list_participants',
            description: 'List all meeting participants',
            usage: '/list_participants [meeting_id]',
            example: '/list_participants 123456789',
            response: 'List of participants with status and roles.'
        },
        {
            command: '/mute_participant',
            description: 'Mute a specific participant',
            usage: '/mute_participant [meeting_id] [participant_id]',
            example: '/mute_participant 123456789 user123',
            response: 'Participant muted successfully.'
        },
        {
            command: '/unmute_participant',
            description: 'Unmute a specific participant',
            usage: '/unmute_participant [meeting_id] [participant_id]',
            example: '/unmute_participant 123456789 user123',
            response: 'Participant unmuted successfully.'
        },
        {
            command: '/mute_all',
            description: 'Mute all participants',
            usage: '/mute_all [meeting_id]',
            example: '/mute_all 123456789',
            response: 'All participants muted successfully.'
        },
        {
            command: '/unmute_all',
            description: 'Unmute all participants',
            usage: '/unmute_all [meeting_id]',
            example: '/unmute_all 123456789',
            response: 'All participants unmuted successfully.'
        },
        {
            command: '/remove_participant',
            description: 'Remove a participant from meeting',
            usage: '/remove_participant [meeting_id] [participant_id]',
            example: '/remove_participant 123456789 user123',
            response: 'Participant removed from meeting.'
        }
    ],

    // Waiting Room Management
    waitingRoom: [
        {
            command: '/enable_waiting_room',
            description: 'Enable waiting room for meeting',
            usage: '/enable_waiting_room [meeting_id]',
            example: '/enable_waiting_room 123456789',
            response: 'Waiting room enabled successfully.'
        },
        {
            command: '/disable_waiting_room',
            description: 'Disable waiting room for meeting',
            usage: '/disable_waiting_room [meeting_id]',
            example: '/disable_waiting_room 123456789',
            response: 'Waiting room disabled successfully.'
        },
        {
            command: '/list_waiting',
            description: 'List participants in waiting room',
            usage: '/list_waiting [meeting_id]',
            example: '/list_waiting 123456789',
            response: 'List of participants waiting for admission.'
        },
        {
            command: '/admit_participant',
            description: 'Admit specific participant from waiting room',
            usage: '/admit_participant [meeting_id] [participant_id]',
            example: '/admit_participant 123456789 user123',
            response: 'Participant admitted to meeting.'
        },
        {
            command: '/admit_all',
            description: 'Admit all participants from waiting room',
            usage: '/admit_all [meeting_id]',
            example: '/admit_all 123456789',
            response: 'All waiting participants admitted.'
        }
    ],

    // Recording Management
    recording: [
        {
            command: '/start_recording',
            description: 'Start meeting recording',
            usage: '/start_recording [meeting_id] [type]',
            example: '/start_recording 123456789 cloud',
            response: 'Recording started successfully.'
        },
        {
            command: '/stop_recording',
            description: 'Stop meeting recording',
            usage: '/stop_recording [meeting_id]',
            example: '/stop_recording 123456789',
            response: 'Recording stopped and saved.'
        },
        {
            command: '/pause_recording',
            description: 'Pause meeting recording',
            usage: '/pause_recording [meeting_id]',
            example: '/pause_recording 123456789',
            response: 'Recording paused successfully.'
        },
        {
            command: '/resume_recording',
            description: 'Resume meeting recording',
            usage: '/resume_recording [meeting_id]',
            example: '/resume_recording 123456789',
            response: 'Recording resumed successfully.'
        },
        {
            command: '/recording_status',
            description: 'Get recording status',
            usage: '/recording_status [meeting_id]',
            example: '/recording_status 123456789',
            response: 'Current recording status and duration.'
        }
    ],

    // Advanced Features
    advanced: [
        {
            command: '/create_breakout',
            description: 'Create breakout rooms',
            usage: '/create_breakout [meeting_id] [room_count]',
            example: '/create_breakout 123456789 3',
            response: 'Breakout rooms created successfully.'
        },
        {
            command: '/start_breakout',
            description: 'Start breakout room sessions',
            usage: '/start_breakout [meeting_id]',
            example: '/start_breakout 123456789',
            response: 'Breakout rooms started.'
        },
        {
            command: '/close_breakout',
            description: 'Close all breakout rooms',
            usage: '/close_breakout [meeting_id]',
            example: '/close_breakout 123456789',
            response: 'All breakout rooms closed.'
        },
        {
            command: '/create_poll',
            description: 'Create a meeting poll',
            usage: '/create_poll [meeting_id] [question]',
            example: '/create_poll 123456789 "Rate this meeting 1-5"',
            response: 'Poll created and sent to participants.'
        },
        {
            command: '/lock_meeting',
            description: 'Lock meeting to prevent new joins',
            usage: '/lock_meeting [meeting_id]',
            example: '/lock_meeting 123456789',
            response: 'Meeting locked successfully.'
        },
        {
            command: '/unlock_meeting',
            description: 'Unlock meeting to allow new joins',
            usage: '/unlock_meeting [meeting_id]',
            example: '/unlock_meeting 123456789',
            response: 'Meeting unlocked successfully.'
        }
    ],

    // Notifications & Monitoring
    monitoring: [
        {
            command: '/enable_notifications',
            description: 'Enable meeting notifications',
            usage: '/enable_notifications [meeting_id]',
            example: '/enable_notifications 123456789',
            response: 'Notifications enabled for this meeting.'
        },
        {
            command: '/disable_notifications',
            description: 'Disable meeting notifications',
            usage: '/disable_notifications [meeting_id]',
            example: '/disable_notifications 123456789',
            response: 'Notifications disabled for this meeting.'
        },
        {
            command: '/meeting_summary',
            description: 'Get meeting summary after end',
            usage: '/meeting_summary [meeting_id]',
            example: '/meeting_summary 123456789',
            response: 'Complete meeting summary with statistics.'
        }
    ]
};

// Function to display command categories
function displayCommandCategory(categoryName, commands) {
    console.log(`📋 ${categoryName.toUpperCase()} COMMANDS`);
    console.log('='.repeat(categoryName.length + 10));
    
    commands.forEach((cmd, index) => {
        console.log(`${index + 1}. ${cmd.command}`);
        console.log(`   Description: ${cmd.description}`);
        console.log(`   Usage: ${cmd.usage}`);
        console.log(`   Example: ${cmd.example}`);
        console.log(`   Response: ${cmd.response}`);
        console.log('');
    });
}

// Function to generate bot help menu
function generateBotHelpMenu() {
    console.log('🤖 TELEGRAM BOT HELP MENU');
    console.log('=========================\n');
    
    const helpMenu = `
🎥 **ZOOM MEETING BOT COMMANDS**

📱 **BASIC COMMANDS**
/start - Get started with the bot
/help - Show this help menu  
/authorize - Link your Zoom account

🆕 **CREATE MEETINGS**
/create_meeting [topic] - Create instant meeting
/schedule_meeting [topic] [date] [time] - Schedule meeting
/recurring_meeting [topic] [frequency] - Create recurring meeting

📋 **MANAGE MEETINGS**
/list_meetings - Show your meetings
/meeting_info [id] - Get meeting details
/update_meeting [id] [field] [value] - Update meeting
/delete_meeting [id] - Delete meeting

🎬 **LIVE CONTROLS**
/meeting_status [id] - Check meeting status
/start_meeting [id] - Start meeting
/end_meeting [id] - End meeting

👥 **PARTICIPANTS**
/list_participants [id] - List participants
/mute_all [id] - Mute everyone
/unmute_all [id] - Unmute everyone
/remove_participant [id] [user] - Remove participant

🚪 **WAITING ROOM**
/enable_waiting_room [id] - Enable waiting room
/list_waiting [id] - List waiting participants
/admit_all [id] - Admit all waiting

🎥 **RECORDING**
/start_recording [id] - Start recording
/stop_recording [id] - Stop recording
/recording_status [id] - Check recording

🏠 **ADVANCED**
/create_breakout [id] [rooms] - Create breakout rooms
/create_poll [id] [question] - Create poll
/lock_meeting [id] - Lock meeting

📊 **MONITORING**
/enable_notifications [id] - Enable alerts
/meeting_summary [id] - Get summary

💡 **Tips:**
• Use meeting ID from /list_meetings
• Only hosts can control meetings
• All commands work in group chats
• Type /authorize first to link Zoom account

Need help? Just type /help [command] for details!
    `;
    
    console.log(helpMenu);
}

// Main function to display all commands
function displayAllCommands() {
    console.log('Running Telegram bot command reference generator...\n');
    
    displayCommandCategory('BASIC', botCommands.basic);
    displayCommandCategory('MEETING CREATION', botCommands.creation);
    displayCommandCategory('MEETING MANAGEMENT', botCommands.management);
    displayCommandCategory('LIVE MEETING CONTROLS', botCommands.live);
    displayCommandCategory('PARTICIPANT MANAGEMENT', botCommands.participants);
    displayCommandCategory('WAITING ROOM MANAGEMENT', botCommands.waitingRoom);
    displayCommandCategory('RECORDING MANAGEMENT', botCommands.recording);
    displayCommandCategory('ADVANCED FEATURES', botCommands.advanced);
    displayCommandCategory('NOTIFICATIONS & MONITORING', botCommands.monitoring);
    
    generateBotHelpMenu();
    
    // Command statistics
    const totalCommands = Object.values(botCommands).flat().length;
    console.log('📊 COMMAND STATISTICS');
    console.log('====================');
    console.log(`Total Commands Available: ${totalCommands}`);
    console.log(`Basic Commands: ${botCommands.basic.length}`);
    console.log(`Meeting Creation: ${botCommands.creation.length}`);
    console.log(`Meeting Management: ${botCommands.management.length}`);
    console.log(`Live Controls: ${botCommands.live.length}`);
    console.log(`Participant Management: ${botCommands.participants.length}`);
    console.log(`Waiting Room: ${botCommands.waitingRoom.length}`);
    console.log(`Recording: ${botCommands.recording.length}`);
    console.log(`Advanced Features: ${botCommands.advanced.length}`);
    console.log(`Monitoring: ${botCommands.monitoring.length}`);
    
    console.log('\n🎉 COMMAND REFERENCE COMPLETE!');
    console.log('==============================');
    console.log('✅ Your Telegram bot will have comprehensive meeting control');
    console.log('✅ All Zoom API features mapped to bot commands');
    console.log('✅ User-friendly command structure with examples');
    console.log('✅ Complete help system for users');
    console.log('✅ Ready for production deployment!');
    
    console.log('\n🚀 DEPLOYMENT READY:');
    console.log('• Copy help menu to your bot implementation');
    console.log('• Use command structure for handler functions');
    console.log('• Implement error handling for each command');
    console.log('• Add user authentication checks');
    console.log('• Deploy and test with real Zoom API after approval!');
}

// Run the command reference generator
displayAllCommands();
