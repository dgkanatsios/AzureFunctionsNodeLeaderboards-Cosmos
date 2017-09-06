function log(req, msg) {
    req.context.log(msg);
}

module.exports = {
    log
};