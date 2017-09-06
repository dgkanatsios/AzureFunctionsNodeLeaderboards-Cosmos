require('dotenv').config();

const express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
Score = require('./api/models/scoresModel'), //created model loading here
bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handle 404
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

const routes = require('./api/routes/scoresRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);