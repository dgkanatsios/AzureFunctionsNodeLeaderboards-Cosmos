const config = require('./config');

function log(msg, req) {
    if (config.DEBUG_GLOBAL !== true) return;

    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
}

//method found in https://jsperf.com/numbers-and-integers
//if value is a valid integer, it returns the value
//else it returns NaN
function getInteger(value) {
    if (typeof value === 'number' && (value % 1) === 0) {
        return parseInt(value);
    } else
        return NaN;
}

module.exports = {
    log,
    getInteger
};