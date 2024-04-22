FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY typedoc.json ./

COPY src ./src

RUN npm install

RUN npm run build:docker

FROM node:18-alpine

WORKDIR /vr-dashboard/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN npm ci --only=production

COPY --from=0 /app/build ./src
COPY --from=0 /app/docs ./docs

ENV NODE_ENV=production
ENV APP_MODE=PRODUCTION

EXPOSE 8080

WORKDIR /vr-dashboard/app/src


CMD ["node", "./index.js"]
