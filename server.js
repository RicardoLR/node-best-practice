'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8081;

const user_routes = require('./src/routes/users');
const school_routes = require('./src/routes/school');

const mongoose = require('mongoose');

// Sin docker
//mongoose.connect('mongodb://localhost:27017/swagger-demo');

mongoose.connect("mongodb://mongo:27017/swagger", {
  autoReconnect: true
}); // connect to our database

let app = express();

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use( '/api/v1/users', user_routes );
app.use( '/api/v1/schools', school_routes );


/**
 * Lectura de configuraciones en JSON para Swagger
 * 
 */

// fs.readdirSync( path.join(__dirname, '.', "swagger/") ).forEach( (nameFile) => {  
//   fs.readFile(path.join(__dirname, '.', "swagger/"+nameFile), 'utf8', (err, data) => {
//     console.log("data", data);
//   });
// })

// async function readContetFile(nameFile) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, '.', "swagger/"+nameFile), 'utf8', (err, data) => {
//       if (err) reject(err); 
//       else resolve(data);
//     })
//   });
// }


async function readFiles() {
  return new Promise((resolve, reject) => {
    let arrayNames = []
    fs.readdirSync( path.join(__dirname, '.', "swagger/paths/") ).forEach( (nameFile) => {
        if( nameFile.includes(".json") )
          arrayNames.push(nameFile)
        resolve(arrayNames);
    })
  });
}

let readContetFile = (f) => fs.readFileSync(path.join(__dirname, '.', "swagger/paths/"+f),'utf8');

const configSwagger = async () => {
  let bufferFileSwagger = {};

  const files = await readFiles();
  files.map( f => {
    const originalContent = readContetFile(f);
    //bufferFileSwagger.push(originalContent)
    bufferFileSwagger = Object.assign(bufferFileSwagger, JSON.parse(originalContent));
  })

  return await bufferFileSwagger
}

configSwagger().then(( swagger) => {
  swaggerDocument.paths = swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});

app.listen( port, () => {
  console.log('server run localhost:', app.get('port'));
});

module.exports = app;


/**
 * contruccion
 * 
    docker build --no-cache -t ricci/node-swagger .

    docker images

    docker run -p 8081:8081 -d ricci/node-swagger

    docker ps
    docker logs <container id>

    docker exec -it <container id> /bin/bash
    curl -i localhost:49160
 */