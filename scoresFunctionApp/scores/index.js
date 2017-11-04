require('dotenv').config();

const express = require("express");
const app = express(),
    utilities = require('./utilities'),
    mongoose = require('mongoose'),
    Score = require('./api/models/scoresModel'), //load the model to avoid MissingSchemaError
    User = require('./api/models/usersModel'),
    paginate = require('express-paginate');

//don't use body-parser on Functions runtime, only when running locally in node environment
//https://stackoverflow.com/a/43620157/1205817    
if (process.env.AZURE_FUNCTIONS_RUNTIME === 'false') {
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
});

// keep this before all routes that will use pagination
app.use(paginate.middleware(10, 50));

const routes = require('./api/routes/scoresRoutes'); //importing routes
routes(app); //register the routes

//handle 404
app.use(function (req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found, sorry!'
    })
});

//are we running in a local node environment on in Azure Functions?
if (process.env.AZURE_FUNCTIONS_RUNTIME === 'false') {
    app.listen(process.env.PORT);
    utilities.log(`Running on port ${process.env.PORT}`);
    module.exports = app; //for testing
} else {
    const createHandler = require("azure-function-express").createHandler;
    module.exports = createHandler(app);
}