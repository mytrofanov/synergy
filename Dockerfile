FROM node:16.14.0

WORKDIR /backend

COPY package*.json  /backend

RUN npm install

COPY . .

ENV PORT 5000

EXPOSE $PORT

CMD ["npm", "start"]



