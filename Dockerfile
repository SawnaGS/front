FROM node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY dist/library-fe/browser /usr/share/nginx/html

EXPOSE 80
