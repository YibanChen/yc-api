FROM ubuntu:latest
FROM node:14

RUN apt-get update

RUN export ipfs_staging="staging"
RUN export ipfs_staging="/staging"
RUN apt-get -y install \
    gnupg \
    curl


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY ipfs /usr/local/bin/ipfs

RUN ipfs init
RUN ipfs daemon &

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]
