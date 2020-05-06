FROM node:12.16.2 as react
WORKDIR /app
COPY ./FrontEnd .
RUN npm install
RUN npm run build

FROM node:12.16.2
WORKDIR /OrthancToolsJs
RUN mkdir build
RUN ls
COPY --from=react /app/build ./build/
COPY ./BackEnd .
RUN ls
RUN npm install --only=prod

EXPOSE 4000
ENV OrthancAddress http://localhost
ENV OrthancPort 8042
ENV OrthancUsername orthanc
ENV OrthancPassword orthanc
CMD [ "npm", "start" ]