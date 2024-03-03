# Base image
FROM node:20-alpine

RUN apk add --no-cache \
    make \
    gcc \
    g++

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package*.json ./

# install nest/cli as global
RUN npm i -g @nestjs/cli node-gyp

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
