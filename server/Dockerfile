FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "server"]