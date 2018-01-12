# Technical details - AzureFunctionsNodeLeaderboards-Cosmos ![](https://gaforgithub.azurewebsites.net/api?repo=AzureFunctionsNodeLeaderboardsCosmosTechnicalDetails&empty)


## Database architecture

You can easily get acquainted with the database architecture by checking the User and Score Mongoose models on `scores/api/models` folder. We're using Mongoose discriminators to save everything on a single Cosmos DB collection. That's why you'll aso find a base model schema, that refers to a single collection called `gamedata`.

### Score schema

Score schema contains:
- the actual score value (required)
- the userId and username of the user that achieved the score (they have been set up by the authorization headers)
- optional createdAt timestamp
- an optional text description

The createdAt timestamp may be not set, so the value will be created by the server or set by the client. This can be useful for mobile game scenarios that may have poor connectivity - in this way, score data can be kept offline and pushed to the server upon client connection. If it's set, it must be of a valid value or else the API will return error 400. We're using [moment.js](https://momentjs.com) for date parsing.

### User schema

User schema contains:
- userId (saved in _id) and username of the user (they have been set up by the authorization headers)
- createdAt timestamp
- user's max score
- an integer that holds the number of times user has played (i.e. number of times that user has POSTed a score)
- an array that holds user's latest scores (array length is equal to `latestScoresPerUserToKeep` value set in the `config.js` file)

## Authentication / Authorization

All requests to all methods of the leaderboards API should contain two HTTP headers:

- `x-ms-client-principal-id`
- `x-ms-client-principal-name`

These two headers are validated (i.e. checked for undefined) in the `authhelper.js` file, which is used as a custom Express middleware. If they're empty, the called leaderboards API method returns HTTP error 401. If they exist, they get transformed (copied) to `CUSTOM_USERID` and `CUSTOM_USERNAME`, respectively, so they can be used from the rest of your application code. Azure App Service (the platform on which Azure Functions) has an option to activate Authentication and authorization via numerous providers (Azure Active Directory, Facebook, Google, Microsoft Account, Twitter) and is thoroughly described [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview). These providers should fill the necessary headers. Moreover, it is worth mentioning that there is no applied authorization on the API calls. This means that all authenticated users can call all methods with any kind of parameters.

Feel free to use your own authentication mechanism, if required. For example, you could modify `authhelper.js` file so that the values passed are checked towards a database that contains your user information. This means that the user has authenticated using a custom mechanism you have provided. You can use various Node packages that will help you with authentication, one of the most known ones is [Passport](http://www.passportjs.org/). Search for `passport boilerplate` if you want to find pre-made solutions for user credentials storage and authentication.

## Using a Docker container

You can use the included Dockerfile on the `scores` folder to build the leaderboards API app as a Docker container. You can use the container in [Web App for Containers/App Service on Linux](https://docs.microsoft.com/en-us/azure/app-service/containers/) or even on a [Azure Container Service](https://docs.microsoft.com/en-us/azure/aks/) Kubernetes cluster. Your container image(s) can be hosted on [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/). Check a sample architeture for this deployment(s):

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeLeaderboards-Cosmos/blob/master/media/docker.JPG?raw=true "Reference architecture for usage of a Docker container on Azure Container Service or Web App for Containers")

### Build Docker image
To build the Docker image, cd to the `leaderboardsFunctionApp/scores` directory and run the Docker build CLI command:

```bash
docker build -t username/azurefunctionsnodeleaderboards:0.1 .
```

Of course, you can (should!) replace **username**,**azurefunctionsnodeleaderboards** and the tagged version with the values of your choice. To run the container locally, you can use the following command:

```bash
docker run -d -p 3000:3000 -e "MONGODB_CONNECTION_STRING=mongodb://node-scores:12345678@node-scores.documents.azure.com:10255/?ssl=true&replicaSet=globaldb" --name leaderoardsapi username/azurefunctionsnodeleaderboards:0.1 
```

Don't forget to set your correct Cosmos DB connection string and your Docker image name.

- To see how you can host your Docker image on Azure Web App for Containers, check [here](https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image)
- To create a managed Kubernetes Azure Container Service (AKS) cluster, check [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough)

You can find some Docker build commands on `various/docker.sh` whereas you can find a Kubernetes deployment YAML file on `various/kubedeploy.yaml`.

## Unity client

On the folder `client-unity` you can find a Unity client (built with Unity 5.6, but other 5.x versions could work) that accesses the Leaderboards API operations using the standard [UnityWebRequest](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.html) class. Inside the Unity project you can find a sample scene that demonstrates accessing the API calls. To make this work, modify the `LeaderboardsSDKHelper` game object's URL property on the editor with your Function's endpoint (like `https://nodecosmos.azurewebsites.net/`). Click `Play` on the Editor, or export to your platform of choice and enjoy accessing your Leaderboards API on Azure Functions!

### First call might be slow!
As described on the [FAQ](FAQ.md), the first call to the Azure Function will take some time, be patient.

### API calls

Here you can see the list of all the methods in the Unity SDK that correspond to the leaderboard API methods. All methods should be called on the ```LeaderboardsSDKClient.Instance``` singleton object.

| Operation | Unity SDK call | 
| --- | --- |
| POST https://functionURL/api/scores | CreateScore(Score instance, Action<CallbackResponse<User>> oncreateScoreCompleted) |
| GET https://functionURL/api/users/:userId | GetUserDetails(string userID, Action<CallbackResponse<User>> callback) |
| GET https://functionURL/api/user/scores/:count | ListScoresForCurrentUser(int count, Action<CallbackResponse<Score[]>> callback)
| GET https://functionURL/api/scores/top/:count | ListTopScores(int count, Action<CallbackResponse<Score[]>> callback) |
| GET https://functionURL/api/users/maxscore/:count | ListTopScorePerUser(int count, Action<CallbackResponse<Score[]>> callback) |
| GET https://functionURL/api/scores/top/today/:count | ListTodayTopScores(int count, Action<CallbackResponse<Score[]>> callback) |
| GET https://functionURL/api/users/toptotaltimesplayed/:count | ListTopScorePerUser(int count, Action<CallbackResponse<User[]>> callback) |
| GET https://functionURL/api/scores/latest/:count | ListLatestScores(int count, Action<CallbackResponse<Score[]>> callback) |
| GET https://functionURL/api/scores/:scoreId | ListScore(string scoreId, Action<CallbackResponse<Score>> callback) |
| GET https://functionURL/api/users/surroundingbyscore/:userId/:count | ListUsersSurroundingByScore(string userId, int count, Action<CallbackResponse<User[]>> callback) |

### Sample API call

All API calls follows the callback scheme. Callback contains a boolean to determine whether the network call has been successful, the (potential) error details and the actual API call result. For an example, check the following code that lists the top scores for all users:

```csharp
public void ListTopScoresForAllUsers()
    {
        //get the top 10 scores for all users
        LeaderboardsSDKClient.Instance.ListTopScoresForAllUsers(10, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "List top scores for all users completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        Debug.Log(string.Format("username is {0},value is {1}", item.username, item.value));
                    }
                StatusText.text = result;
            }
            else
            {
                ShowError(response.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }
```

### Authentication

You need to set two required HTTP headers when calling the leaderboard API methods. These are set in the sample game with the following lines of code:

```csharp
    //get the authentication token(s) somehow...
    //e.g. for facebook, check the Unity Facebook SDK at https://developers.facebook.com/docs/unity
    LeaderboardsSDKClient.Instance.userID = "CURRENT_PLAYER_UNIQUE_ID";
    LeaderboardsSDKClient.Instance.username = "CURRENT_PLAYER_USERNAME";
```

You need to somehow set them yourself, either using unique values stored in game's local storage, or get them via a web service you own, or use custom authentication means (like [Facebook login](https://developers.facebook.com/docs/unity)).