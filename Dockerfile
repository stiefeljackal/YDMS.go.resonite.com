# Base image
FROM node:23-alpine

# Setting work directory
WORKDIR /usr/src/app

# We do this as a separate step as it optimizes the build of the image. Docker runs in stages and caches each stage.
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]