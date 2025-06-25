FROM node:latest
RUN npm install
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
COPY . .
WORKDIR /app
CMD ["npm", "start"]
