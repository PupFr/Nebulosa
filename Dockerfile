# Build configuration for Railway
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package-bot.json package.json
COPY production-bot.js .

# Install dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the bot
CMD ["node", "production-bot.js"]
