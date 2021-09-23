FROM node:14.15.4 as react
WORKDIR /app
COPY ./FrontEnd .
RUN npm install
RUN npm run build

FROM node:14.15.4 as ohif
RUN apt-get update -qy && \
    apt-get install -y --no-install-recommends apt-utils\
    git
WORKDIR /ohif
RUN git clone https://github.com/OHIF/Viewers.git
RUN cd Viewers && yarn install && QUICK_BUILD=true PUBLIC_URL=/viewer-ohif/ yarn run build

FROM alpine as stone
RUN apk --no-cache add wget
RUN apk add --update zip
RUN wget https://lsb.orthanc-server.com/stone-webviewer/2.0/wasm-binaries.zip
RUN mkdir /stone
RUN unzip wasm-binaries.zip -d /stone

FROM node:14.15.4
WORKDIR /OrthancToolsJs
RUN mkdir build
COPY --from=react /app/build ./build/
COPY --from=ohif /ohif/Viewers/platform/viewer/dist ./build/viewer-ohif/
COPY --from=stone /stone/wasm-binaries/StoneWebViewer ./build/viewer-stone/
COPY --from=react /app/build/viewer-ohif/app-config.js ./build/viewer-ohif/
COPY --from=react /app/build/viewer-stone/configuration.json ./build/viewer-stone/

COPY ./BackEnd .
RUN yarn install --only=prod

EXPOSE 4000
ENV OrthancAddress http://localhost
ENV OrthancPort 8042
ENV OrthancUsername orthanc
ENV OrthancPassword orthanc
CMD [ "yarn", "start" ]