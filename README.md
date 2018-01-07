# AzureFunctionsNodeLeaderboards-Cosmos

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![Build Status](https://travis-ci.org/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos.svg?branch=master)](https://travis-ci.org/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![unofficial Google Analytics for GitHub](https://gaforgithub.azurewebsites.net/api?repo=AzureFunctionsNodeLeaderboardsCosmos)](https://github.com/dgkanatsios/gaforgithub)

**WORK IN PROGRESS**!!! This project is a starter kit that allows you to set up a RESTful API service that stores game leaderboards (scores) and exposes them via HTTP(s) methods/operations. A game developer can use this API service in their game and post new scores, get the top scores, find out the latest ones  and get surrounding (ranked) top players of a current user. A Unity client is also provided with a corresponding C# SDK.

## Deployment

One-click deployment via [Azure ARM template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) is supported, click the button below to deploy the project in your Azure subscription.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2FAzureFunctionsNodeLeaderboard%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

The deployment will take some time to execute (due to resources' creation and time to pull code from GitHub), please be patient.
Be aware that App name, Storage account name and CosmosDB database name must all be globally unique. Otherwise, the deployment will fail to complete and you will see an error message in the Azure portal. In this case, you should delete the created Resource Group and try again.

## High level architecture

Proposed technology/architecture stack includes an [Express](https://expressjs.com/) [Node.js](https://nodejs.org/) app hosted on an [Azure Function](https://azure.microsoft.com/en-us/services/functions/) that talks to a [CosmosDB](https://azure.microsoft.com/en-us/services/cosmos-db/) database via its [MongoDB API]((https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction)). [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) service is used to provide information and metrics regarding application performance and behavior. A Unity game engine client is also provided, with a relevant SDK to access the leaderboards API.

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos/blob/master/media/functions.JPG?raw=true "Reference architecture")

On the software side of things, [Mongoose](http://mongoosejs.com) is used to facilitate interactions between the JavaScript code and the database whereas the frontend API calls are served by [Express](https://expressjs.com/) web framework. Also, the [azure-functions-express](https://github.com/yvele/azure-function-express) package is used to facilitate the usage of Express framework within an Azure Function.

## Designing the leaderboard

Leaderboards within games can easily vary. In designing this library, we tried to satisfy the below requirements:

- store all scores for all users (of course!)
- a score object is immutable (so you will not find any update methods here)
- we need to easily get the top score of each user
- we need to easily get the latest scores of each user
- we need to easily get the top scores for today
- we need to easily get the top scores of all time, along with the users that got them
- we need to easily get the surrounding ranked players along with their top score compared to our user
- authentication and authorization are not implemented (but hints and guidelines on how to add these mechanisms are provided)

## Usage
After you deploy the script, you will have an Azure Resource Group containing the following resources:

- A CosmosDB database that uses the MongoDB API
- A Storage Account
- An App Service Name that hosts the Azure Function with its relevant App Service Plan
- The Azure Function that will pull the code from the GitHub repo you designate and an Application Insights service to monitor its execution

Now, you can call the available web service operations from your game. You can visit the Azure Portal to get the Azure Function URL, it will be in the format https://**functionName**.azurewebsites.net

## Authentication
All requests to the leaderboards API **must** contain two headers on each request: `x-ms-client-principal-id` and `x-ms-client-principal-name`. If these values are missing, then the request will fail. The `x-ms-client-principal-id` should be unique for each user. Meaning, each time you use the same `x-ms-client-principal-id` for inserting a new score, this score will belong to the same user. The implemented leaderboards API does not impose any method to validate/verify these values, so you are free to implement whatever you like. However, App Service supports various authentication methods which automatically set the required headers, you can check them [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview). For more details on authentication/authorization, please check [here](docs/technicalDetails.md).

## Operations supported

Here you can see a short list/summary of all the operations that are supported, check [here](docs/operations.md) for full details and response samples.

| VERB | URL | Description | 
| --- | --- | --- |
| POST | https://**functionURL**/api/scores | Creates a new score. Post body has the format { "value":Integer value of the score, ... }. Returns the updated user details. |
| GET | https://**functionURL**/api/users/:userId | Gets a specific user's details, including top score and latest scores | 
| GET | https://**functionURL**/api/user/scores/:count | Gets the top 'count' scores for logged in user sorted by score value |
| GET | https://**functionURL**/api/scores/top/:count | Gets top scores achieved in the game by all users, in descending order. This can include more than one score per user |
| GET | https://**functionURL**/api/users/maxscore/:count | Gets the scores achieved by each unique user, in descending order. Practically this includes the max score per single user |
| GET | https://**functionURL**/api/scores/today/top/:count | Gets the top 'count' scores for today |
| GET | https://**functionURL**/api/users/toptotaltimesplayed/:count | Gets the top 'count' users for all time in regards to the times they have played (i.e. number of times they have posted a new score).|
| GET | https://**functionURL**/api/scores/latest/:count | Gets the latest 'count' scores |
| GET | https://**functionURL**/api/scores/:scoreID | Gets a specific score |
| GET | https://**functionURL**/api/users/surroundingbyscore/:userId/:count | Gets the surrounding users of the requested one, ordered by their max score |
| GET | https://**functionURL**/api/health | Gets the application's health |

## Docker
You might notice that there is a Dockerfile inside the Azure Functions code. Check the [docs/technicalDetails.md](docs/technicalDetails.md) file for instructions on how to build and run the projet on a Docker container.

## More details 
- Check the [docs/FAQ.md](docs/FAQ.md) for answers to common questions you may have about the project.
- Check the [docs/operations.md](docs/operations.md) for the list of all supported HTTP methods of the leaderboards API.
- Check the [docs/technicalDetails.md](docs/technicalDetails.md) for various technical details of the project.

## License
This project is licensed under the MIT License.