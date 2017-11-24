const config = require('./config');
function log(msg, req) {
    if(config.DEBUG_GLOBAL !== true) return;
    
    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
}

module.exports = {
    log
};