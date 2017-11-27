const authenticator = function (req, res, next) {
   
    req.headers['CUSTOM_USERID'] = req.headers['x-ms-client-principal-id'];
    req.headers['CUSTOM_USERNAME'] = req.headers['x-ms-client-principal-name'];
    //if you want to use App Service integrated authentication, check below
    //https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview
   
    if (req.headers['CUSTOM_USERID'] && req.headers['CUSTOM_USERNAME']) {
        next();
    } else {
        res.status(401).send({
            error: 'Unauthorized! You should properly set headers x-ms-client-principal-id and x-ms-client-principal-name'
        });
    }
}

module.exports = authenticator;