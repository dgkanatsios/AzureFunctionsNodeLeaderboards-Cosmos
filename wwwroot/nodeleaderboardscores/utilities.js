function log(req, msg) {
    if (req.context)
        req.context.log(msg);
}

module.exports = {
    log
};