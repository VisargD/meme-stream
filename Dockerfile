FROM node:14

WORKDIR /usr/src/app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

ENV PORT=8081

ENV DOCKER="mongodb://mongo:27017/xmeme"

EXPOSE 8081

CMD [ "npm", "start" ]