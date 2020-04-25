FROM node:12.16.2

WORKDIR /usr/src/OrthancToolsJs

COPY ./FrontEnd ./FrontEnd
COPY ./BackEnd ./BackEnd

WORKDIR /usr/src/OrthancToolsJs/FrontEnd
RUN npm install

RUN npm run build
COPY ./build ../BackEnd/

WORKDIR /usr/src/OrthancToolsJs/BackEnd
RUN npm install

EXPOSE 4000
CMD [ "npm", "start" ]