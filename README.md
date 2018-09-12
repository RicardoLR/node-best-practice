
## Requirements

* Docker
* Docker-compose

## Usage

* Install dependencies `npm i`
* Start docker-compose `docker-compose up` or start you own MongoDB `docker-compose up --build`

Api documentation can be found on: `http://localhost:8081/api-docs`

## Con Docker
# Correr y tener Mongo en local
    node server.js
    http://localhost:8081

# Pasos para Dockerizar

1. crear Dockerfile
$ docker build -t richi/auth-app .

2. Luego crear docker-compose.yml

$ docker-compose up

