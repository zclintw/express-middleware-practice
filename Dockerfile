FROM node:12

WORKDIR /web

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["npm", "run", "web"]
