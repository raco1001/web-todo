FROM node:latest

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY *.json ./

COPY .env ./

COPY ./src ./

RUN npm install


CMD ["npm", "run", "start:dev"]
