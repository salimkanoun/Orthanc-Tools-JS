FROM node:12.16.2


WORKDIR /usr/src/OrthancToolsJs

COPY ./FrontEnd ./FrontEnd
COPY ./BackEnd ./BackEnd

WORKDIR /usr/src/OrthancToolsJs/FrontEnd
RUN npm install

COPY ./build ../BackEnd/

WORKDIR /usr/src/OrthancToolsJs/BackEnd
RUN npm install

EXPOSE 4000
CMD [ "node", "server.js" ]