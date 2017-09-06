require('dotenv').config();
const createHandler = require("azure-function-express").createHandler;
const express = require("express");
const app = express(),
    mongoose = require('mongoose'),
    Score = require('./api/models/scoresModel'); //created model loading here

if(process.env.LOCAL_EXECUTION){
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const routes = require('./api/routes/scoresRoutes'); //importing route
routes(app); //register the route

//handle 404
app.use(function (req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
});

if (process.env.LOCAL_EXECUTION) {
    app.listen(3000);
    console.log("Running on port 3000");
} else {
    module.exports = createHandler(app);
}