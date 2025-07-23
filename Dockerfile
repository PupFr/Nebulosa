# Build configuration for Railway
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and bot script
COPY package.json .
COPY railway-bot-simple.js .

# Install dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the bot
CMD ["node", "railway-bot-simple.js"]
