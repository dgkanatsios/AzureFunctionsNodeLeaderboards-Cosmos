# Frequently Asked Questions -  AzureFunctionsNodeLeaderboards-Cosmos

Here you can find answers to many questions you may have around the project. If your question is not answered here, feel free to raise an issue.

## Index

- [Running and testing](#running-and-testing)
- [Extending](#extending)
- [Monitoring](#monitoring)
- [Various](#various)

## Running and testing 

### How can I develop this project locally?
After you fork/clone the project, you could run it locally with `node index.js` on the `scores` folder. You should include a `.env` file that sets necessary environment variables. Moreover, you can check [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for details on how to run the Functions runtime locally and test the project within its context. After you install Azure Functions tools, simply run `func host start` on the Function(s) root directory (for our project it's the directory `scoresFunctionApp`) and your function will start accepting requests. Don't forget to create a [local.settings.json](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#local-settings-file) file that contains your environment variables in the `leaderboardsFunctionApp` folder. Here is a sample file.

```javascript
{
    "IsEncrypted": false,
    "Values": {
        "MONGODB_CONNECTION_STRING": "mongodb://nodecosmos:PASSWORD@nodecosmos.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
        "AZURE_FUNCTIONS_RUNTIME": "true",
        "NODE_ENV": "development"
    },
    "Host": {
        "LocalHttpPort": 7071,
        "CORS": "*"
    }
}
```

### What frameworks are you using for testing?
We use [mocha](https://mochajs.org/) test framework and [chai](http://chaijs.com/) assertion library. To execute the tests, just run `npm test` on the shell prompt. The tests are executed on a test database (name is set on the `config.js` file). Also, do not forget to create a `.env` file on the `scores` directory and assign your environmental variables there. Check below for a sample `.env` file that is used for development and testing.

```
MONGODB_CONNECTION_STRING=mongodb://nodecosmos:PASSWORD@nodecosmos.documents.azure.com:10255/?ssl=true&replicaSet=globaldb
PORT=3000
AZURE_FUNCTIONS_RUNTIME=false
NODE_ENV=development
```
### How can I see the data on my CosmosDB instance?
[Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) is a  free and cross-platform tool that allows you to browse your Azure Storage accounts as well as your CosmosDB databases. You can also use familiar MongoDB related tools, like [MongoChef](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-mongochef) and [Robomongo](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-robomongo).


### What can I use for authentication/authorization?
If you want to protect your game leaderboards from unauthorized access, you should implement an appropriate mechanism. Azure App Service (a service which Azure Functions sits on) has an excellent implementation that you can use to protect your backend and it is documented [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview). To use it in this Functions app, comment the appropriate lines in the `authhelper.js` file.

### Can I compress HTTP output?
Originally I was using [expressjs/compression](https://github.com/expressjs/compression) middleware. However, I encountered some instability during local development, not sure why (maybe it doesn't work so well with Azure Functions runtime?). Give it a shot and let me know if it works for you! If you use a proxy, you may want to delegate the CPU-intensive process to your reverse proxy, same goes if you want to use a certificate for SSL connections (shameless plug: check [here](https://dgkanatsios.com/2017/07/07/using-ssl-for-a-service-hosted-on-a-kubernetes-cluster/) for another article of mine on how to easily configure SSL for a Kubernetes cluster).

### I want to extend the leaderboards API and add more operations. How can I do that?
1. Add the desired route on the api/routes/leaderboardsRoutes.js
2. The route you just added should correspond to a method in api/controllers/leaderboardsController.js
3. You may wish to use one of the helper methods in api/controllers/controllerHelpers.js

### I use Postman, do you recommend it for testing?
Me too, it's awesome, isn't it? If you don't know [Postman](https://www.getpostman.com/), it's a free app to test your APIs, highly recommended. To get started, you can find and import my set of requests from the `various/nodeleaderboardscores.postman_collection.json` file.

## Extending

### How to extend the Score or the User object?
Easy! Find the relevant JavaScript file in the api/models/folder and update it to your preferences. Added fields/properties will 'automagically' be persisted in the database.

### Do you accept PRs? I found a bug/I want to request a new feature
Sure, if you want to contribute via a pull request, go ahead! For bugs/features/complaints, I would be really grateful if you reported them [here](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboard/issues).

### What if I want to set up some rate limit for my API?
Since your API is stateless, you should use a store to preserve state in order to properly limit client requests and protect your API. A cool option to do that is [Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/) in alignment with one of these excellent express modules: [strict-rate-limiter](https://www.npmjs.com/package/strict-rate-limiter), [express-brute](https://www.npmjs.com/package/express-brute), or [rate-limiter](https://www.npmjs.com/package/express-limiter). If you want to use a fast and scalable backend for these modules or if you just want something to cache your data, we recommend the [Azure Redis Cache](https://docs.microsoft.com/en-us/azure/redis-cache/) service.

## Monitoring

### What are Request Units (RUs) in CosmosDB?
CosmosDB is a multi-tenant database. As such, you don't rent a CosmosDB server with specific hardware specifications. When you use CosmosDB, you pay for something called 'Request Units' (RUs) which is a measure of the computing resources that are needed in order to serve a specific client request. To find out more about RUs, check the official documentation [here](https://docs.microsoft.com/en-us/azure/cosmos-db/request-units#request-units-and-request-charges).

### How much do I pay for the CosmosDB database this project is creating?
For the most updated pricing details, check out the official pricing documentation [here](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/). Be aware that the collection that is created by the project uses 1000RUs (this is the default), you can modify it via Azure Portal or programmatically and scale it down to 400RUs (that's the minimum), if you don't need the extra horse power. If you do need it though, you could as easily scale it up to 10.000 RUs.

### How can I see how many (RUs) my queries are consuming? 
There are various ways that you can monitor your RUs consumption, check the official documentation [here](https://docs.microsoft.com/en-us/azure/cosmos-db/request-units#use-api-for-mongodbs-portal-metrics) to see some of them. If you happen to have many similar queries hitting the database in a short amount of time, maybe you should consider refactoring the project to add a caching layer (we recommend [Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/)) for your data.

### Tell me more about CosmosDB partitioning and scaling
Please check the official and frequently updated documentation [here](https://docs.microsoft.com/en-us/azure/cosmos-db/partition-data).

### Where is the Application Insights documentation?
The Function gets configured to use Application Insights for instrumentation. Check [here](https://docs.microsoft.com/en-us/azure/application-insights/). Below you can see two screenshots that contain some of the performance metrics Application Insights can generate for you.

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos/blob/master/media/appInsights1.JPG?raw=true "Application Insights overview metrics")

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos/blob/master/media/appInsights2.JPG?raw=true "Application Insights performance")

 You can check [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring) for a detailed guide about Azure Functions + Application Insights integration. Also, you can take a look at the Storage account that's created with the Azure Function, some logs about Function's calls are kept there.

## Various

### What resources are created by the ARM template deployment (azuredeploy.json file)?
You should the following resources created in your Azure subscription
- A CosmosDB database account
- A Storage account (that backs your Azure Function)
- An App Service Plan (uses the Consumption plan)
- An App Service (hosts your Function)
- An Application Insights service that monitors your Function

Check here a reference screenshot

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos/blob/master/media/resourcegroup.JPG?raw=true "Resources created by ARM deployment")

If you are new to Azure, you should check the ARM documentation [here](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).

### The calls to the Azure Function are sometimes a bit slow. Why?
There is an idle timeout for Azure Functions that are hosted on a Consumption Plan, check [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#consumption-plan) for details. This can lead to your Azure Functions host being removed (due to timeout) and re-added (due to a new API call). You can alter the default timeout (which is 5 minutes) by modifying the `functionTimeout` in `host.json`. It can be set to a maximum of 10 minutes, as per the code below.

```javascript
// Set functionTimeout to 10 minutes
{
    "functionTimeout": "00:10:00"
}
```

Other two options to prevent this behavior would be
- Use [App Service Plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#app-service-plan) instead of Consumption plan to host your Function
- Create a separate Function using a [timer trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer). This Function would be triggered every couple of minutes and just send a HTTP request to your Leaderboards API Function. In this way, the Leaderboards API Function idle timeout would never occur, so your Leaderboards API Function calls would always be fast.

Moreover, on the very first call to your Azure Function  (the so-called "cold start") there will be a delay as node installs, reads and loads all module files. They are cached, though, so subsequent executions have significantly better performance. You can check [here](https://github.com/Azure/azure-functions-pack) for a way this can be improved (even though this approach hasn't been tested with current project).

### I saw you're using Mongoose discriminators. Why?
To save you some money. CosmosDB charges per collection, check [here](https://anthonychu.ca/post/cosmos-db-mongoose-discriminators/) for a relevant blog post.

### How much does CosmosDB cost?
You can read [here](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/) in order to undestand CosmosDB pricing.

### Can I try CosmosDB for free?
Yup! Check [here](https://azure.microsoft.com/en-us/try/cosmosdb/). Also, check [here](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction) to learn more about MongoDB API for CosmosDB. For CosmosDB use cases, check [here](https://docs.microsoft.com/en-us/azure/cosmos-db/use-cases). For some free Azure resources, check [here](https://azure.microsoft.com/en-us/free/).

### Where is the Azure Functions documentation? How are Functions charged?
Check [here](https://docs.microsoft.com/en-us/azure/azure-functions/). When you deploy the Function via the ARM template provided, you are billed by Azure Functions consumption plan. Great thing with consumption plan is that the first million calls per month are free. It's a pretty cost-effecive plan, for the specifics rest you should check the relevant pricing page [here](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-feature-support).

### Which Azure region should I deploy my project to?
Microsoft Azure operates in many datacenters around the globe, you can check them [here](https://azure.microsoft.com/en-us/regions/). If you want to see the latency between them and your location, you can use various online tools such as [azurespeed.com](http://www.azurespeed.com/) or [azurespedtest.azurewebsites.net](http://azurespeedtest.azurewebsites.net/).

### Is there a Visio diagram for the project architecture?
Check `architecture.vsdx` in the `various` folder.

### All this is great, but I'd like something simpler for my Unity game, is there anything else?
You can check [here](https://github.com/dgkanatsios/AzureServicesForUnity) for a Unity client that can communicate with various Azure PaaS services like [App Service Easy Tables](https://blog.xamarin.com/getting-started-azure-mobile-apps-easy-tables/), [Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-what-is-event-hubs) and [Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/). Check [here](https://dgkanatsios.com/2016/04/14/use-azure-services-from-unity/) for the relevant blog post.