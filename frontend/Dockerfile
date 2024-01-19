# Base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g @angular/cli@17

# Copy package.json and package-lock.json to the working directory
COPY ./package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]