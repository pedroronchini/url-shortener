FROM node:20
WORKDIR /url-shortener
COPY . .
RUN npm install
RUN npm rebuild sqlite3
ENTRYPOINT npm start