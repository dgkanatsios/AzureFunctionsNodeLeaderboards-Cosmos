# AzureFunctionsNodeLeaderboards-Cosmos - Frequently Asked Questions

#### How to extend the Score or the User object?
Easy! Find the relevant JavaScript file in the api/models/folder and update it to your preferences. Added fields/properties will 'automagically' be persisted in the database.

#### Do you accept PRs? I found a bug/I want to request a new feature
Sure, if you want to contribute via a pull request, go ahead! For bugs/features/complaints, I would be really grateful if you reported them [here](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboard/issues).

#### The calls to the Azure Function are sometimes a bit slow. Why?
There is an idle timeout for Azure Functions on Consumption Plan, check [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#consumption-plan) for details. Moreover, on this so-called "cold start" there is a delay as node reads all module files. They are cached, though, so subsequent executions have much better performance. You can check [here](https://github.com/Azure/azure-functions-pack) for a way this can be improved (we haven't tested this approach with this project). You can also alter the default timeout by modifying the `functionTimeout` in `host.json`.

#### How can I develop/test this project locally?
Check [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for details on how to run the Functions runtime locally. After you install Azure Functions tools, run `func host start` on the Function(s) root directory (for our project it's the directory `scoresFunctionApp`). Don't forget to set a [local.settings.json](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#local-settings-file) file that contains your environment variables.

#### What frameworks are you using for tests?
We use [mocha](https://mochajs.org/) test framework and [chai](http://chaijs.com/) assertion library. To execute the tests, just run `npm test` on the shell prompt.

#### I saw you're using Mongoose discriminators. Why?
To save you some money. CosmosDB charges per collection, check [here](https://anthonychu.ca/post/cosmos-db-mongoose-discriminators/) for a relevant blog post.

#### How can I see the data on my CosmosDB instance?
Check [this](https://azure.microsoft.com/en-us/features/storage-explorer/) free and cross-platform tool. You can also use familiar MongoDB related tools, like [MongoChef](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-mongochef) and [Robomongo](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-robomongo).

#### Can I try CosmosDB for free?
Yup! Check [here](https://azure.microsoft.com/en-us/try/cosmosdb/). Check [here](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction) to learn more about MongoDB API for CosmosDB. For CosmosDB use cases, check [here](https://docs.microsoft.com/en-us/azure/cosmos-db/use-cases). For some free Azure, also check [here](https://azure.microsoft.com/en-us/free/).

#### What can I use for authentication/authorization?
If you want to protect your game leaderboards from unauthorized access, you should implement an appropriate mechanism. Azure App Service (a service which Azure Functions sits on) has an excellent implementation that you can use to protect your backend and it is documented [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview). To use it in this Functions app, comment the appropriate lines in the `authhelper.js` file.

#### What if I want to set up some rate limit for my API?
Since your API is stateless, you should use a store to preserve state in order to properly limit client requests and protect your API. A cool option to do that is [Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/) in alignment with one of these excellent express modules: [strict-rate-limiter](https://www.npmjs.com/package/strict-rate-limiter), [express-brute](https://www.npmjs.com/package/express-brute), or [rate-limiter](https://www.npmjs.com/package/express-limiter).

#### Where is the Azure Functions documentation? How are Functions charged?
Check [here](https://docs.microsoft.com/en-us/azure/azure-functions/). When you deploy the Function via the ARM template provided, you are billed by Azure Functions consumption plan. First million calls per month are free, for the rest check the pricing page [here](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-feature-support).

#### Where is the Application Insights documentation?
Check [here](https://docs.microsoft.com/en-us/azure/application-insights/). Below you can see two screenshots that contain some of the performance metrics Application Insights can generate for you. 

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeScores-Cosmos/blob/master/media/appInsights1.JPG?raw=true "Application Insights overview metrics")

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeScores-Cosmos/blob/master/media/appInsights2.JPG?raw=true "Application Insights performance")

#### All this is great, but I'd like something simpler for my Unity game, is there anything else?
You can check [here](https://github.com/dgkanatsios/AzureServicesForUnity) for a Unity client that can communicate with various Azure PaaS services like [App Service Easy Tables](https://blog.xamarin.com/getting-started-azure-mobile-apps-easy-tables/), [Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-what-is-event-hubs) and [Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/).

#### Can I compress HTTP output?
Originally I was using [expressjs/compression](https://github.com/expressjs/compression) middleware. However, I encountered some instability during local development, not sure why (maybe it doesn't work so well with Azure Functions runtime?). Give it a shot and let me know if it works for you!

#### I want to extend the API and add more operations. How can I do that?
1. Add the desired route on the api/routes/leaderboardsRoutes.js
2. The route you just added should correspond to a method in api/controllers/leaderboardsController.js
3. You may wish to use one of the helper methods in api/controllers/controllerHelpers.js