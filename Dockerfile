FROM node:14

WORKDIR /usr/src/app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

ENV PORT=8081

EXPOSE 8081

CMD [ "npm", "start" ]