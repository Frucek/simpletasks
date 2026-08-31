FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.6.4
RUN npm ci --omit=dev
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]