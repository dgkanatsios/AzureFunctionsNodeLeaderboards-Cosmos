const authenticator = function (req, res, next) {
    //if using Azure App Service authentication https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview
    //req.headers['CUSTOM_USERID'] = req.headers['x-ms-client-principal-id'];
    //req.headers['CUSTOM_USERNAME'] = req.headers['x-ms-client-principal-name'];

    //comment these two lines if using App Service authentication
    req.headers['CUSTOM_USERID'] = req.body.userId;
    req.headers['CUSTOM_USERNAME'] = req.body.userName;

    if (req.headers['CUSTOM_USERID'] && req.headers['CUSTOM_USERNAME']) {
        next();
    } else {
        res.status(401).send({
            error: 'Unauthorized!'
        });
    }
}

module.exports = authenticator;