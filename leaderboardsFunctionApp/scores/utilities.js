const config = require('./config');

function logInfo(msg, req) {
    log('INFO: ' + msg, req);
}

function logError(error, req) {

    log('ERROR: ' + error, req);
}

function log(msg, req) {

    if (config.DEBUG_LOCAL === false) return;

    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
}



//parses the connection string
//connects to the DB
//returns a promise
function mongoConnect(mongooseInstance) {
    //get server connection string
    let connectionString = process.env.MONGODB_CONNECTION_STRING;
    //add the database name
    const pos = connectionString.lastIndexOf('/');
    const databaseName = process.env.NODE_ENV === 'test' ? config.databaseNameTest : config.databaseName;
    connectionString = connectionString.substring(0, pos) + `/${databaseName}` + connectionString.substring(pos + 1);

    //above methods need to be executed because Mongo connection string should also contain the database name
    //whereas the one that gets created from the ARM template contains only the server related details, not the the database name
    //mongodb://node-scores:12345678==@node-scores.documents.azure.com:10255/?ssl=true&replicaSet=globaldb

    //mongoose instance connection 
    mongooseInstance.Promise = global.Promise;
    return mongooseInstance.connect(connectionString, {
        useMongoClient: true,
    });
}

//method found in https://jsperf.com/numbers-and-integers
//if value is a valid integer, it returns the value
//else it returns NaN
function getInteger(value) {
    let parsedValue = parseInt(value);
    if (typeof parsedValue === 'number' && (parsedValue % 1) === 0) {
        return parsedValue;
    } else
        return NaN;
}

module.exports = {
    logInfo,
    logError,
    getInteger,
    mongoConnect
};