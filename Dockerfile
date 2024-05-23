FROM ruby:3.3.0-alpine

RUN apk add --no-cache nodejs yarn git

ENV NODE_ENV=production

WORKDIR /client

COPY client/package.json client/yarn.lock client/tailwind.config.js ./

RUN yarn install

COPY client/public ./public
COPY client/src ./src

RUN yarn run build

WORKDIR /server

COPY server/package.json server/yarn.lock ./
RUN yarn install

WORKDIR /app

COPY server .
RUN cp -r /server/node_modules ./node_modules
RUN cp -r /client/build ./public

EXPOSE 3000

CMD ["yarn", "start"]
