FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the backend source code
COPY . .

# Expose port and run server
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

CMD ["npm", "start"]
