FROM node:20-alpine

WORKDIR /usr/src/app

COPY src .

RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]