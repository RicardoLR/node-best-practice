'use strict';

const express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8081;

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Sin docker
//mongoose.connect('mongodb://localhost:27017/swagger-demo');


mongoose.connect("mongodb://mongo:27017/swagger", {
  autoReconnect: true
}); // connect to our database


let UserSchema = new Schema({
  correo: {type: String},
  // correo: {
  //   type: String, required: true,
  //   trim: true, // unique: true,
  //   match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  // },
  firstName: {type: String},
  lastName: {type: String}
});
mongoose.model('User', UserSchema);
let User = require('mongoose').model('User');


let SchoolSchema = Schema({
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dueno: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('School', SchoolSchema);
let School = require('mongoose').model('School');


let app = express();

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//middleware for create
let createUser = function (req, res, next) {
  let user = new User(req.body);

  user.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

let updateUser = function (req, res, next) {
  User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

let deleteUser = function (req, res, next) {
  req.user.remove(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(req.user);
    }
  });
};

let getAllUsers = function (req, res, next) {
  User.find(function (err, users) {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

let getOneUser = function (req, res) {
  res.json(req.user);
};

let getByIdUser = function (req, res, next, id) {
  User.findOne({_id: id}, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};


let createSchool = function (req, res, next) {
  let school = new School(req.body);
  school.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(school);
    }
  });
};


let getAllSchools = function (req, res, next) {
  School.find().populate('dueno').populate('users').exec(function (err, schools) {

    if (err) {
      next(err);
    } else {
      res.json(schools);
    }
  });
};

/**
 * http://localhost:8081/api/v1/schools
 */
router.route('/schools')
  .post(createSchool)
  .get(getAllSchools);

/**
 * http://localhost:8081/api/v1/users
 */
router.route('/users')
  .post(createUser)
  .get(getAllUsers);


router.route('/users/:userId')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

router.param('userId', getByIdUser);



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
    fs.readdirSync( path.join(__dirname, '.', "swagger/") ).forEach( (nameFile) => {
        if( nameFile.includes(".json") )
          arrayNames.push(nameFile)
        resolve(arrayNames);
    })
  });
}

let readContetFile = (f) => fs.readFileSync(path.join(__dirname, '.', "swagger/"+f),'utf8');

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


app.use('/api/v1', router);

app.listen(port);
module.exports = app;



/**
 * contruccion
 * 
    docker build -t ricci/node-swagger .

    docker images

    docker run -p 8081:8081 -d ricci/node-swagger

    docker ps
    docker logs <container id>

    docker exec -it <container id> /bin/bash
    curl -i localhost:49160
 */