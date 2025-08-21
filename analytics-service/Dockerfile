FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to keep production image clean
RUN npm prune --production

# Create necessary directories
RUN mkdir -p logs reports

# Expose port
EXPOSE 3003

# Start the application
CMD ["npm", "start"]
