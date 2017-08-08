FROM valentinvieriu/alpine-node-arm:latest


RUN mkdir /app && mkdir /app/photos && mkdir /aux
RUN apk add --no-cache git && \
    git clone https://github.com/celaus/pi-camera-api /app && \
    cd /app && \
    npm install && \
    apk del git

VOLUME /app/photos

EXPOSE 6300

WORKDIR /app

CMD ["npm", "start"]