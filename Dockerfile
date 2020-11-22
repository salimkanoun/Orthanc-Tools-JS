FROM node:12.16.2 as react
WORKDIR /app
COPY ./FrontEnd .
RUN npm install
RUN npm run build


FROM node:12.16.2 as ohif
RUN apt-get update -qy && \
    apt-get install -y --no-install-recommends apt-utils\
    git
WORKDIR /ohif
RUN git clone -b feat/scroll-sync https://github.com/OHIF/Viewers.git
WORKDIR /ohif/Viewers
RUN yarn install
RUN QUICK_BUILD=true PUBLIC_URL=/viewer/ yarn run build
WORKDIR /ohif/Viewers/platform/viewer/dist


FROM node:12.16.2
WORKDIR /OrthancToolsJs
RUN mkdir build
RUN ls
COPY --from=react /app/build ./build/
COPY --from=ohif /ohif/Viewers/platform/viewer/dist ./build/viewer
COPY --from=react /app/build/viewer/app-config.js ./build/viewer
COPY ./BackEnd .
RUN ls
RUN npm install --only=prod

EXPOSE 4000
ENV OrthancAddress http://localhost
ENV OrthancPort 8042
ENV OrthancUsername orthanc
ENV OrthancPassword orthanc
CMD [ "npm", "start" ]