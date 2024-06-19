Dockerizar:

Dockerfile para frontend
FROM node:18

WORKDIR /app/

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install
COPY . /app/

EXPOSE 3001

CMD ["npm","run","dev"]


Dockerfile para backend
FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install cors --save

COPY . .

EXPOSE 3000

CMD ["npm","start"]

Archivo de docker-compose.yml
version: '3.8'
services:
  db:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: desarrollo
      MYSQL_DATABASE: libro
    volumes:
      - db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root --password=desarrollo || exit 1"]
      interval: 5s
      timeout: 10s
      retries: 10
  
  backend: 
    build: ./Backend_Libro/Backend_Libro/Backend_Libro
    ports:
      - "3007:3007"
    depends_on:
      db:
        condition: service_healthy
  
  frontend:
    build: ./FRONTED/libro
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  db-data:





