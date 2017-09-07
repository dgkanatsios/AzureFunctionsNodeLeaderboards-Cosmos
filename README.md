# AzureFunctionsNodeLeaderboard

**Work in progress** - Set up an Express Node.js app on an Azure Function that talks to CosmosDB via MongoDB protocol. Click the button below to deploy.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2FAzureFunctionsNodeLeaderboard%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

The script will take some time to execute (due to resources creation and npm install execution), please be patient.
Be aware that AppService name, storage account name and database name must all be globally unique. If not, the script will fail to execute. 


## Usage
After you deploy the script, you will have an Azure Resource Group will the following resources
- A CosmosDB database that uses the MongoDB API
- A Storage Account
- An App Service Name that hosts the Azure Function
- The Azure Function will pull the code from the GitHub repo you designate

Now you can call the available web service methods from your game. You can visit the Azure Portal to get the Azure Function URL, it will have the format https://**functionName**.azurewebsites.net

## Methods supported
| VERB | Name | URL | Description |
| --- | --- | --- | --- |
| GET | listAllScores | https://**functionURL**/api/scores | Gets all the scores for all users |
| GET | listAllScoresForUserID | https://**functionURL**/api/scores/user/:userID | Gets all the scores for userID sorted by score value |
| GET | listScoresForUserIDDateDesc | https://**functionURL**/api/scores/user/latest/:userID | Gets the scores for userID  sorted by createdDate value|
| POST | createScore | https://**functionURL**/api/scores | Creates a new score. Post body has the format { "userID":"The ID of the User", "value":Integer value of the score } |
| GET | getScore | https://**functionURL**/api/scores/:scoreID | Gets a specific score |
| PUT | updateScore | https://**functionURL**/api/scores/:scoreID | Updates a specific score |

## FAQ

#### How to extend the score object
Easy! Find the api/models/scoresModel.js file and update it to your preferences

#### Do you accept PRs?
Sure, go ahead!

#### I found a bug/I want to request a new feature
I would be really grateful if you reported it [here](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboard/issues)

#### The first call is always terribly slow. Why?
Yup, for the time being. Check [here](https://github.com/Azure/azure-functions-pack) for a way it can be improved (no, I haven't tested it yet)