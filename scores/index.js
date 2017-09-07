require('dotenv').config();
const createHandler = require("azure-function-express").createHandler;
const express = require("express");
const app = express(),
    utilities = require('./utilities'),
    mongoose = require('mongoose'),
    Score = require('./api/models/scoresModel'); //created model loading here

//don't use body-parser on Functions runtime
//https://stackoverflow.com/a/43620157/1205817    
if (process.env.LOCAL_EXECUTION) {
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useMongoClient: true,
    /* other options */
});

const db = mongoose.connection;
db.on('error', function () {
    utilities.log('cannot connect to MongoDB');
});
db.once('open', function () {
    utilities.log('successfully connected to MongoDB');
});

const routes = require('./api/routes/scoresRoutes'); //importing routes
routes(app); //register the routes

//handle 404
app.use(function (req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found, sorry!'
    })
});

//are we running in a local environment on in Azure Functions?
if (process.env.LOCAL_EXECUTION) {
    app.listen(process.env.PORT);
    utilities.log(`Running on port ${process.env.PORT}`);
} else {
    module.exports = createHandler(app);
}