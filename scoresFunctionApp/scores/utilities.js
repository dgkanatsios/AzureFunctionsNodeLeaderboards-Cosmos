function log(msg, req) {
    if(DEBUG_GLOBAL !== true) return;
    
    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
}

let DEBUG_GLOBAL;

module.exports = {
    log,
    DEBUG_GLOBAL
};