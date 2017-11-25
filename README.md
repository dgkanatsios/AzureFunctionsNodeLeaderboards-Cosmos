# AzureFunctionsNodeLeaderboard

Set up an Express Node.js app on an Azure Function that talks to CosmosDB via MongoDB protocol. Click the button below to deploy.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2FAzureFunctionsNodeLeaderboard%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

The script will take some time to execute (due to resources creation and npm install execution), please be patient.
Be aware that AppService name, storage account name and database name must all be globally unique. If not, the script will fail to execute. 

## Designing the leaderboard

Leaderboards within games can easily vary. In designing this library, we tried to satisfy the below requirements

- store all scores (of course!)
- a score object is immutable
- we need to store all scores for each user
- we need to see the top scores of each user
- we need to see the top scores for every day (or a specific time period)
- we need to see the top scores of all time, along with the users that accomplished them

## Usage
After you deploy the script, you will have an Azure Resource Group will the following resources
- A CosmosDB database that uses the MongoDB API
- A Storage Account
- An App Service Name that hosts the Azure Function
- The Azure Function will pull the code from the GitHub repo you designate

Now you can call the available web service methods from your game. You can visit the Azure Portal to get the Azure Function URL, it will have the format https://**functionName**.azurewebsites.net

## Authentication
It is required that you set two headers on each request to the Function, their names are `x-ms-client-principal-id` and `x-ms-client-principal-name`. If values are missing, then you request will fail. The `x-ms-client-principal-id` should be unique for each user. That is, each time you use the same `x-ms-client-principal-id` for inserting a new score, this score will belong to the same user. The 'how' this values are filled is left to you as an implementation. App Service (the service on which Azure Functions is based on) supports various authentication methods, you can check them [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview).

## Operations supported

Here you can see a short list of all the operations that are supported, check [here](OperationsSupported.md) for full details.

| VERB | Method name | URL | Description | Return value |
| --- | --- | --- | --- | --- |
| POST | createScore | https://**functionURL**/api/scores | Creates a new score. Post body has the format { "value":Integer value of the score }. Returns the updated user details. |
| GET | listAllScoresForCurrentUser | https://**functionURL**/api/users/scores | Gets all the scores for logged in user sorted by score value |
| GET | listTopScores | https://**functionURL**/api/scores/top/:count | Gets the top 'count' scores |
| GET | listLatestScores | https://**functionURL**/api/scores/latest/:count | Gets the latest 'count' scores |
| GET | getUser | https://**functionURL**/api/users/:userId | Gets a specific user's details, including top score and latest scores | 
| GET | getScore | https://**functionURL**/api/scores/:scoreID | Gets a specific score |

## FAQ 
Check [here](FAQ.md) for answers to common questions.