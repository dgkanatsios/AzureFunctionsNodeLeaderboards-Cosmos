const config = require('./config');

function log(msg, req) {
 
    if (config.DEBUG_GLOBAL === 'false') return;

    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
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
    log,
    getInteger
};