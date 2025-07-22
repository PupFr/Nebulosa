const axios = require('axios');

/**
 * 💜 Discord Integration for LA NUBE BOT
 * Sends notifications to Discord channels via webhooks
 */

class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.botName = "LA NUBE BOT";
        this.avatarUrl = "https://pupfr.github.io/nebulosa/favicon.svg";
    }

    /**
     * Send a notification to Discord
     */
    async sendNotification(title, description, color = 0x667eea, fields = []) {
        try {
            const embed = {
                title: `🤖 ${title}`,
                description: description,
                color: color,
                timestamp: new Date().toISOString(),
                footer: {
                    text: this.botName,
                    icon_url: this.avatarUrl
                },
                fields: fields
            };

            const payload = {
                username: this.botName,
                avatar_url: this.avatarUrl,
                embeds: [embed]
            };

            await axios.post(this.webhookUrl, payload);
            console.log('✅ Discord notification sent');
        } catch (error) {
            console.error('❌ Discord notification failed:', error.message);
        }
    }

    /**
     * Send OAuth success notification
     */
    async notifyOAuthSuccess(userId, userName) {
        await this.sendNotification(
            "OAuth Authorization Successful",
            `User ${userName} (${userId}) has successfully connected their Zoom account`,
            0x22c55e, // Green
            [
                { name: "User ID", value: userId, inline: true },
                { name: "User Name", value: userName, inline: true },
                { name: "Timestamp", value: new Date().toLocaleString(), inline: true }
            ]
        );
    }

    /**
     * Send multipin operation notification
     */
    async notifyMultipinOperation(userId, operation, meetingId, participantCount) {
        const color = operation === 'pin' ? 0xf59e0b : 0x6b7280; // Yellow for pin, gray for unpin
        
        await this.sendNotification(
            `Multipin Operation: ${operation.toUpperCase()}`,
            `User performed ${operation} operation on meeting ${meetingId}`,
            color,
            [
                { name: "User ID", value: userId, inline: true },
                { name: "Meeting ID", value: meetingId, inline: true },
                { name: "Participants", value: participantCount.toString(), inline: true },
                { name: "Operation", value: operation.toUpperCase(), inline: true }
            ]
        );
    }

    /**
     * Send error notification
     */
    async notifyError(error, context = "") {
        await this.sendNotification(
            "Bot Error Detected",
            `An error occurred in LA NUBE BOT${context ? `: ${context}` : ''}`,
            0xef4444, // Red
            [
                { name: "Error", value: error.message || error, inline: false },
                { name: "Context", value: context || "General", inline: true },
                { name: "Timestamp", value: new Date().toLocaleString(), inline: true }
            ]
        );
    }

    /**
     * Send bot startup notification
     */
    async notifyBotStartup() {
        await this.sendNotification(
            "Bot Started",
            "LA NUBE BOT is now online and ready to serve!",
            0x22c55e, // Green
            [
                { name: "Status", value: "Online", inline: true },
                { name: "Version", value: "1.0.0", inline: true },
                { name: "Features", value: "OAuth, Multipin, Documentation", inline: false }
            ]
        );
    }

    /**
     * Send deployment notification
     */
    async notifyDeployment(platform, url) {
        await this.sendNotification(
            "New Deployment",
            `LA NUBE BOT has been deployed to ${platform}`,
            0x8b5cf6, // Purple
            [
                { name: "Platform", value: platform, inline: true },
                { name: "URL", value: url, inline: false },
                { name: "Status", value: "Live", inline: true }
            ]
        );
    }
}

// Export for use in other files
module.exports = DiscordNotifier;

// Example usage
if (require.main === module) {
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!discordUrl) {
        console.log('⚠️ DISCORD_WEBHOOK_URL not set in environment variables');
        console.log('💡 To get a webhook URL:');
        console.log('1. Go to Discord Server Settings');
        console.log('2. Integrations → Webhooks → New Webhook');
        console.log('3. Copy webhook URL');
        console.log('4. Set as DISCORD_WEBHOOK_URL in .env');
        process.exit(1);
    }

    const notifier = new DiscordNotifier(discordUrl);
    
    // Test notification
    notifier.notifyBotStartup();
}
