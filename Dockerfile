# Stage 1 - build
FROM node:lts-alpine as builder

WORKDIR /app

COPY . .

RUN rm -rf node_modules

RUN npm install -g pnpm
RUN pnpm i
# RUN pmpm prisma generate
RUN pnpm build 

# Stage 2 - production
FROM node:lts-alpine as final

COPY --from=builder /app/.output ./

RUN wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

ENTRYPOINT ["node", "server/index.mjs"]