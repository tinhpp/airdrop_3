FROM node:18.16.1-alpine3.17

WORKDIR /avengersfi/app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "preview"]
