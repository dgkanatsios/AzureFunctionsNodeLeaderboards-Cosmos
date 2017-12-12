# AzureFunctionsNodeLeaderboards-Cosmos - Technical details

## Database architecture

You can easily get acquainted with the database architecture by checking the User and Score Mongoose models on `scores/api/models` folder. We're using Mongoose discriminators to save everything on a single CosmosDB collection. That's why you'll aso find a base model schema, that refers to a single collection called `gamedata`.

### Score schema

Score schema contains:
- the actual score value
- the userId and username of the user that achieved the score
- createdAt timestamp
- an optional description

### User schema

User schema contains:
- userId (saved in _id) and username of the user
- createdAt timestamp
- user's max score
- an integer that holds the number of times user has played (i.e. number of times that user has POSTed a score)
- and an array that holds user's latest scores (array length is equal to `latestScoresPerUserToKeep`)

## Leaderboards API supported REST HTTP methods/operations

Details of all the operations supported in the `leaderboardsFunctionApp` Azure Function. Wherever you see `:count` in the following API calls, this means an integer between 1 and `config.maxCountOfScoresToReturn` (for Score objects) or between 1 and `config.maxCountOfUsersToReturn` (for User objects).

### Index of operations

- [POST https://functionURL/api/scores](#post-httpsfunctionurlapiscores)
- [GET https://functionURL/api/users/:userId](#get-httpsfunctionurlapiusersuserid)
- [GET https://functionURL/api/user/scores/:count](#get-httpsfunctionurlapiusercorescount)
- [GET https://functionURL/api/scores/top/:count](#get-httpsfunctionurlapiscorestopcount)
- [GET https://functionURL/api/users/maxscore/:count](#get-httpsfunctionurlapiusersmaxscorecount)
- [GET https://functionURL/api/scores/today/top/:count](#get-httpsfunctionurlapiscorestodaytopcount)
- [GET https://functionURL/api/users/toptotaltimesplayed/:count](#get-httpsfunctionurlapiuserstoptotaltimesplayedcount)
- [GET https://functionURL/api/scores/latest/:count](#get-httpsfunctionurlapiscoreslatestcount)
- [GET https://functionURL/api/scores/:scoreId](#get-httpsfunctionurlapiscoresscoreid)
- [GET https://functionURL/api/health](#get-httpsfunctionurlapihealth )

### POST https://functionURL/api/scores 
#### Description
Creates a new score. Returns the updated user's details, including top score, latest scores and number of times played. The return value contains the entire user object as well as the latest user's scores. 
#### Post body
```javascript
//createdAt is optional
//description is optional
//50 is the integer value of the score and it is required
{ "value":50, "createdAt":"2017-11-25T14:48:00", "description":"test description" }
```
#### Sample HTTP response
```javascript
{
    "_id": "1234",
    "username": "dimitris",
    "__v": 0,
    "maxScoreValue": 12,
    "totalTimesPlayed": 2,
    "latestScores": [
        {
            "score": "5a1915c40c6eba5c6c74616b",
            "value": 12,
            "_id": "5a1915c50c6eba5c6c74616c"
        },
        {
            "score": "5a191a620c6eba5c6c74616d",
            "value": 12,
            "_id": "5a191a620c6eba5c6c74616e"
        }
    ],
    "createdAt": "2017-11-25T07:03:15.977Z"
}
``` 
To access the score you inserted, you can use
```javascript
const userDetails = ...;//the return value of the API call
const latestScores = userDetails.latestScores; //reference to the latest scores array
const scoreDetails = latestScores[latestScores.length - 1];//reference to the last inserted score, which is the one we created
```

### GET https://functionURL/api/users/:userId 
#### Description
Gets a specific user's details, including top score, latest scores and number of times played.
#### Sample HTTP response
```javascript
{
    "username": "dimitris",
    "maxScoreValue": 12,
    "totalTimesPlayed": 3,
    "latestScores": [
        {
            "score": "5a1915b80c6eba5c6c746165",
            "value": 12,
            "_id": "5a1915b90c6eba5c6c746166"
        },
        {
            "score": "5a1915bb0c6eba5c6c746167",
            "value": 12,
            "_id": "5a1915bb0c6eba5c6c746168"
        },
        {
            "score": "5a1915bc0c6eba5c6c746169",
            "value": 12,
            "_id": "5a1915bc0c6eba5c6c74616a"
        }
    ],
    "createdAt": "2017-11-25T07:03:15.977Z"
}
``` 

### GET https://functionURL/api/user/scores/:count 
#### Description
Gets the top 'count' scores for logged in user sorted by score value.
#### Sample HTTP response
```javascript
[
    {
        "_id": "5a1c0e035d68e203c81dbd54",
        "value": 50,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c0e0d5d68e203c81dbd56",
        "value": 49,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c0e135d68e203c81dbd58",
        "value": 48,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/scores/top/:count 
#### Description
Gets top `count` scores achieved in the game by all users, in descending order. This can include more than one score per user.
#### Sample HTTP response
```javascript
[
    {
        "_id": "5a1c1184fe8c7c03c808c8d4",
        "value": 66,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1152fe8c7c03c808c8ca",
        "value": 51,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1181fe8c7c03c808c8d2",
        "value": 45,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c116dfe8c7c03c808c8ce",
        "value": 43,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1159fe8c7c03c808c8cc",
        "value": 34,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1174fe8c7c03c808c8d0",
        "value": 12,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/users/maxscore/:count
#### Description
Gets all the max scores achieved in the game by all users, in descending order. Practically this includes the max score per user in descending order.
#### Sample HTTP response
```javascript
[
    {
        "_id": "5a1c1184fe8c7c03c808c8d4",
        "value": 66,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1152fe8c7c03c808c8ca",
        "value": 51,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c116dfe8c7c03c808c8ce",
        "value": 43,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/scores/today/top/:count 
#### Description
Gets the top 'count' scores for all users for today only.
#### Sample HTTP response
```javascript
[
    {
        "_id": "5a1c1184fe8c7c03c808c8d4",
        "value": 66,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1152fe8c7c03c808c8ca",
        "value": 51,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1181fe8c7c03c808c8d2",
        "value": 45,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c116dfe8c7c03c808c8ce",
        "value": 43,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1159fe8c7c03c808c8cc",
        "value": 34,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1174fe8c7c03c808c8d0",
        "value": 12,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/users/toptotaltimesplayed/:count 
#### Description
Gets the top users for all time in regards to the times they have played (i.e. number of times they have posted a new score).
#### Sample HTTP response
```javascript
[
    {
        "_id": "1234",
        "username": "dimitris",
        "maxScoreValue": 66,
        "totalTimesPlayed": 4,
        "latestScores": [
            {
                "score": "5a1c1181fe8c7c03c808c8d2",
                "value": 45,
                "_id": "5a1c1181fe8c7c03c808c8d3"
            },
            {
                "score": "5a1c1184fe8c7c03c808c8d4",
                "value": 66,
                "_id": "5a1c1184fe8c7c03c808c8d5"
            },
            {
                "score": "5a1c11d9fe8c7c03c808c8d6",
                "value": 34,
                "_id": "5a1c11d9fe8c7c03c808c8d7"
            },
            {
                "score": "5a1c11ddfe8c7c03c808c8d8",
                "value": 65,
                "_id": "5a1c11ddfe8c7c03c808c8d9"
            }
        ],
        "createdAt": "2017-11-27T13:21:21.544Z"
    },
    {
        "_id": "5412",
        "username": "john",
        "maxScoreValue": 51,
        "totalTimesPlayed": 3,
        "latestScores": [
            {
                "score": "5a1c1152fe8c7c03c808c8ca",
                "value": 51,
                "_id": "5a1c1153fe8c7c03c808c8cb"
            },
            {
                "score": "5a1c1159fe8c7c03c808c8cc",
                "value": 34,
                "_id": "5a1c1159fe8c7c03c808c8cd"
            },
            {
                "score": "5a1c11f1fe8c7c03c808c8da",
                "value": 11,
                "_id": "5a1c11f1fe8c7c03c808c8db"
            }
        ],
        "createdAt": "2017-11-27T13:21:21.544Z"
    },
    {
        "_id": "5678",
        "username": "nick",
        "maxScoreValue": 43,
        "totalTimesPlayed": 2,
        "latestScores": [
            {
                "score": "5a1c116dfe8c7c03c808c8ce",
                "value": 43,
                "_id": "5a1c116dfe8c7c03c808c8cf"
            },
            {
                "score": "5a1c1174fe8c7c03c808c8d0",
                "value": 12,
                "_id": "5a1c1174fe8c7c03c808c8d1"
            }
        ],
        "createdAt": "2017-11-27T13:21:21.544Z"
    }
]
```

### GET https://functionURL/api/scores/latest/:count 
#### Description
Gets the latest 'count' scores.
#### Sample HTTP response
```javascript
[
    {
        "_id": "5a1c11f1fe8c7c03c808c8da",
        "value": 11,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c11ddfe8c7c03c808c8d8",
        "value": 65,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c11d9fe8c7c03c808c8d6",
        "value": 34,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1184fe8c7c03c808c8d4",
        "value": 66,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1181fe8c7c03c808c8d2",
        "value": 45,
        "description": "test description",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1174fe8c7c03c808c8d0",
        "value": 12,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c116dfe8c7c03c808c8ce",
        "value": 43,
        "description": "test description",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1159fe8c7c03c808c8cc",
        "value": 34,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c1152fe8c7c03c808c8ca",
        "value": 51,
        "description": "test description",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/scores/:scoreId 
#### Description
Gets the specific details of a score document.
#### Sample HTTP response
```javascript
{
    "_id": "5a1c11ddfe8c7c03c808c8d8",
    "value": 65,
    "description": "test description",
    "userId": "1234",
    "username": "dimitris",
    "createdAt": "2017-11-26T14:48:00.000Z"
}
``` 

### GET https://functionURL/api/users/surroundingbyscore/:userId/:count
#### Description
Gets the surrounding users of the requested one, ordered by their max score. The :count argument refers to how many better and how many worse scores will be returned. Check below for the response for a request `/api/users/surroundingbyscore/userId20/2`. API returns 5 users' details, 2 with better score than userId20, 2 with worse and userId20 details itself. So, most users that will be returned by this operation are `2 * count + 1`.
#### Sample HTTP response
```javascript
[
    {
        "_id": "userId22",
        "username": "username22",
        "__v": 0,
        "maxScoreValue": 22,
        "totalTimesPlayed": 1,
        "latestScores": [
            {
                "score": "5a2fd067add45342f4209313",
                "value": 22,
                "_id": "5a2fd067add45342f420932e"
            }
        ],
        "createdAt": "2017-12-12T12:49:18.550Z"
    },
    {
        "_id": "userId21",
        "username": "username21",
        "__v": 0,
        "maxScoreValue": 21,
        "totalTimesPlayed": 1,
        "latestScores": [
            {
                "score": "5a2fd067add45342f420932b",
                "value": 21,
                "_id": "5a2fd068add45342f4209333"
            }
        ],
        "createdAt": "2017-12-12T12:49:18.550Z"
    },
    {
        "_id": "userId20",
        "username": "username20",
        "maxScoreValue": 20,
        "totalTimesPlayed": 1,
        "latestScores": [
            {
                "score": "5a2fd067add45342f420931d",
                "value": 20,
                "_id": "5a2fd067add45342f4209323"
            }
        ],
        "createdAt": "2017-12-12T12:49:18.550Z"
    },
    {
        "_id": "userId19",
        "username": "username19",
        "__v": 0,
        "maxScoreValue": 19,
        "totalTimesPlayed": 1,
        "latestScores": [
            {
                "score": "5a2fd067add45342f420931e",
                "value": 19,
                "_id": "5a2fd067add45342f4209326"
            }
        ],
        "createdAt": "2017-12-12T12:49:18.550Z"
    },
    {
        "_id": "userId18",
        "username": "username18",
        "__v": 0,
        "maxScoreValue": 18,
        "totalTimesPlayed": 1,
        "latestScores": [
            {
                "score": "5a2fd067add45342f4209329",
                "value": 18,
                "_id": "5a2fd067add45342f4209330"
            }
        ],
        "createdAt": "2017-12-12T12:49:18.550Z"
    }
]
``` 

### GET https://functionURL/api/health 
#### Description
Gets the status of application's health.
#### Sample HTTP response
```javascript
{
    "_id": "5a1c11ddfe8c7c03c808c8d8",
    "value": 65,
    "description": "test description",
    "userId": "1234",
    "username": "dimitris",
    "createdAt": "2017-11-26T14:48:00.000Z"
}
``` 

## Using a Docker container

You can use the included Dockerfile on the `scores` folder to build the leaderboards API code as a Docker container. You can use the container in [Web App for Containers/App Service on Linux](https://docs.microsoft.com/en-us/azure/app-service/containers/) or even on [Azure Container Service](https://docs.microsoft.com/en-us/azure/aks/). Also, your container image can be hosted on [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/).

![alt text](https://github.com/dgkanatsios/AzureFunctionsNodeScores-Cosmos/blob/master/media/docker.JPG?raw=true "Reference architecture for usage of a Docker container")

### Build Docker image
To build the Docker image, cd to the scoresFunctionApp/scores directory and run the Docker CLI, here's an example

```bash
docker build -t username/azurefunctionsnodescores:0.1 .
```

Of course, you can replace **username**,**azurefunctionsnodescores** with the values of your choice. To run the container locally, you should use the following command

```bash
docker run -d -p 3000:3000 -e "MONGODB_CONNECTION_STRING=mongodb://node-scores:12345678@node-scores.documents.azure.com:10255/mygameDB?ssl=true&replicaSet=globaldb" --name myscoresapi username/azurefunctionsnodescores:0.1 
```
Don't forget to set your correct MongoDB or CosmosDB connection string (including the database name).

## Unity client

On the folder `client-unity` you can find a Unity client (built with Unity 5.6) that accesses the Leaderboards API operations using the standard [UnityWebRequest](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.html) class. Inside the Unity project you can find a sample scene that demonstrates accessing the API calls. To make this work, modify the `LeaderboardsSDKHelper` game object's URL property on the editor with your Function's endpoint (like `https://nodecosmos.azurewebsites.net/`). Click `Play` on the Editor, or export to your platform of choice and enjoy accessing your Leaderboards API on Azure Functions!

### First call
As described on the [FAQ](README.faq.md), the first call to the Azure Function will take some time, be patient.

### API calls
The API follows a callback scheme, check for example the following code to list top scores for all users:

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
