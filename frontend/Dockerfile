FROM node:latest

WORKDIR /frontend

COPY . .

ENV PORT=3000

RUN npm install

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]