### Setting environment variables

```
cd client && cp .env.sample .env && cd .. && cd server && cp .env.sample .env && cd .. && cp .env.sample .env
```

### Run the client in the development mode

```
cd client && yarn start
```

### Run the server in the development mode

```
cd server && yarn start
```

# Run Docker image locally

docker run --env-file .env -p 3000:3000 docuseal-embed-app
