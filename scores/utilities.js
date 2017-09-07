function log(msg, req) {
    if (req && req.context)
        req.context.log(msg);
    else
        console.log(msg);
}

module.exports = {
    log
};