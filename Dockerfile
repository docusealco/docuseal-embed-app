FROM ruby:3.3.0-alpine

RUN apk add --no-cache nodejs yarn git

ENV NODE_ENV=production

WORKDIR /client

COPY client/package.json client/yarn.lock ./

RUN yarn install

COPY client/public ./public
COPY client/src ./src

RUN yarn run build

WORKDIR /app

COPY /client/build ./public

WORKDIR /server

COPY server/package.json server/yarn.lock ./
RUN yarn install

WORKDIR /app

COPY server .

EXPOSE 3000

CMD ["yarn", "start"]
