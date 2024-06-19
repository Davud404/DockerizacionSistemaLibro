FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install cors --save

COPY . .

EXPOSE 3000

CMD ["npm","start"]
