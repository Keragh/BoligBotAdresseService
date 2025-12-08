# Use official Node LTS
FROM node:20-bullseye

# Set working directory
WORKDIR /workspace

# Copy ONLY dependency files first
COPY package*.json ./

# Install dependencies (works even with peer dependency mismatches)
RUN npm install --legacy-peer-deps || npm install

# Copy the rest of the project
COPY . .

# Expose common ports
EXPOSE 3001 5000 8080

# Default CMD (optional)
CMD ["npm", "run", "dev"]
