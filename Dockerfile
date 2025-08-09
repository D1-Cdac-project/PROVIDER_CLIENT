FROM node:18-alpine
WORKDIR /APP
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5174
CMD ["npm","run","dev","--","--host","0.0.0.0"]