FROM node:18.19.0
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm ci && \
    npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
