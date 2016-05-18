
FROM node:latest

RUN apt-get update 

RUN mkdir /modern-web

RUN npm install gulp -g
RUN npm install nodemon -g

WORKDIR /modern-web
ADD app/package.json /modern-web/package.json
RUN npm install

EXPOSE 8888

CMD ["npm", "start"]