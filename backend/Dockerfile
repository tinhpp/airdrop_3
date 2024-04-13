FROM node:18.16.1-alpine3.17

WORKDIR /avengersfi/backend

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
