FROM node:20-slim

# Install ffmpeg dan python3 (dibutuhkan yt-dlp)
RUN apt-get update && apt-get install -y ffmpeg python3 git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]