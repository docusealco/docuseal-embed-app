FROM alpine

RUN apk add --no-cache nodejs yarn git

ENV NODE_ENV=production
ENV REACT_APP_DOCUSEAL_URL=https://docuseal.com
ENV REACT_APP_DOCUSEAL_CDN_HOST=cdn.docuseal.com

WORKDIR /client

COPY client/package.json client/yarn.lock client/tailwind.config.js ./
COPY client/public ./public
COPY client/src ./src

RUN yarn install && yarn run build && rm -rf ./node_modules

WORKDIR /server

COPY server/package.json server/yarn.lock ./
RUN yarn install

WORKDIR /app

COPY server .
RUN cp -r /server/node_modules ./node_modules
RUN cp -r /client/build ./public

EXPOSE 3000

CMD ["yarn", "start"]
