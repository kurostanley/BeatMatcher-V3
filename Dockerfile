FROM --platform=linux/amd64 node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME ["/app/node_modules"]

CMD ["npm", "start"]
