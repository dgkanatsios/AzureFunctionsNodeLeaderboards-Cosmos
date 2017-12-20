# Leaderboards API supported HTTP methods/operations - AzureFunctionsNodeLeaderboards-Cosmos

Details of all the operations supported in the `leaderboardsFunctionApp/scores` Azure Function. Wherever you see `:count` in the following API calls, this stands for an integer between 1 and `config.maxCountOfScoresToReturn` (for Score objects) or between 1 and `config.maxCountOfUsersToReturn` (for User objects). These maximums are defined in `config.js` file, feel free to modify them if needed.

### Index of operations

- [POST https://functionURL/api/scores](#post-httpsfunctionurlapiscores)
- [GET https://functionURL/api/users/:userId](#get-httpsfunctionurlapiusersuserid)
- [GET https://functionURL/api/user/scores/:count](#get-httpsfunctionurlapiuserscorescount)
- [GET https://functionURL/api/scores/top/:count](#get-httpsfunctionurlapiscorestopcount)
- [GET https://functionURL/api/users/maxscore/:count](#get-httpsfunctionurlapiusersmaxscorecount)
- [GET https://functionURL/api/scores/top/today/:count](#get-httpsfunctionurlapiscorestoptodaycount)
- [GET https://functionURL/api/users/toptotaltimesplayed/:count](#get-httpsfunctionurlapiuserstoptotaltimesplayedcount)
- [GET https://functionURL/api/scores/latest/:count](#get-httpsfunctionurlapiscoreslatestcount)
- [GET https://functionURL/api/scores/:scoreId](#get-httpsfunctionurlapiscoresscoreid)
- [GET https://functionURL/api/health](#get-httpsfunctionurlapihealth )

In all the following methods, you should replace *functionURL* with your API's domain name, e.g. nodecosmos.azurewebsites.net.

### POST https://functionURL/api/scores 
#### Description
Creates a new score. Returns the updated user's details, including top score, latest scores and number of times played (which is equal to the number of times this method has been called for the specific user
#### Post body
```javascript
//createdAt and description are optional
//50 is the required integer value of the score
{ "value":50, "createdAt":"2017-11-25T14:48:00", "description":"test description" }
```
#### Sample HTTP response
```javascript
{
    "_id": "1234",
    "username": "dimitris",
    "__v": 0,
    "maxScoreValue": 50,
    "totalTimesPlayed": 2,
    "latestScores": [
        {
            "score": "5a1915c40c6eba5c6c74616b",
            "value": 9,
            "_id": "5a1915c50c6eba5c6c74616c"
        },
        {
            "score": "5a191a620c6eba5c6c74616d",
            "value": 50,
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

If the value provided for the `score` is not an integer, the API will return a 400 HTTP Error (Bad Request). The validation is taking place at the `utilities.js` file.

### GET https://functionURL/api/users/:userId 
#### Description
Gets a specific user's details, including top score, latest scores and number of times played.
#### Sample HTTP response
```javascript
{
    "username": "dimitris",
    "maxScoreValue": 18,
    "totalTimesPlayed": 3,
    "latestScores": [
        {
            "score": "5a1915b80c6eba5c6c746165",
            "value": 12,
            "_id": "5a1915b90c6eba5c6c746166"
        },
        {
            "score": "5a1915bb0c6eba5c6c746167",
            "value": 16,
            "_id": "5a1915bb0c6eba5c6c746168"
        },
        {
            "score": "5a1915bc0c6eba5c6c746169",
            "value": 18,
            "_id": "5a1915bc0c6eba5c6c74616a"
        }
    ],
    "createdAt": "2017-11-25T07:03:15.977Z"
}
``` 

If the `userId` provided does not exist in the database, error 400 is returned.

### GET https://functionURL/api/user/scores/:count 
#### Description
Gets the top 'count' scores for logged in user sorted by descending score value. Logged in user is defined by the `x-ms-client-principal-id` HTTP header.
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
        "description": "test description2",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c0e135d68e203c81dbd58",
        "value": 48,
        "description": "test description3",
        "userId": "1234",
        "username": "dimitris",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

If the userId cannot be found in the database, error 400 is returned.

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
Gets the `count` maximum scores achieved in the game by all users, in descending order. Practically, this will bring the top `count` best scores of each user.
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
        "description": "test description2",
        "userId": "5412",
        "username": "john",
        "createdAt": "2017-11-26T14:48:00.000Z"
    },
    {
        "_id": "5a1c116dfe8c7c03c808c8ce",
        "value": 43,
        "description": "test description3",
        "userId": "5678",
        "username": "nick",
        "createdAt": "2017-11-26T14:48:00.000Z"
    }
]
``` 

### GET https://functionURL/api/scores/top/today/:count 
#### Description
Gets the top 'count' scores for all users for today. Time is calculated based on server time.
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
Gets the top users for all time in regards to the times they have played (this is equal to the number of times they have posted a new score). Users are sorted in descending order of their times played.
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
Gets the latest 'count' scores for all users. Scores are sorted in descending order of the datetime they were achieved.
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
Gets the specific details of a specific score.
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

If the specific scoreId is not found, an error 400 is returned.

### GET https://functionURL/api/users/surroundingbyscore/:userId/:count
#### Description
Gets the surrounding users of the requested one, ordered by their max score. The :count argument refers to how many better and how many worse scores will be returned. Check below for the response for a request `/api/users/surroundingbyscore/userId20/2`. API returns 5 users' details, 2 with better score than userId20, 2 with worse and userId20 details itself. So, most users that will be returned by this operation are `2 * count + 1`. If the user with the specific userId is not found, an error 400 is returned.
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

This operation might be computationally expensive, since it may take 3 Read executions on the database for it to complete. You should be cautious in using it, check the [FAQ](README.faq.md) for additional details on how to see the amount of Request Units it takes to execute.

### GET https://functionURL/api/health 
#### Description
Gets the status of application's health. Underneath, it tries to connect to the database. It will return HTTP 200 if everything works as intended or error 500 if something regarding the database is broken.
#### Sample HTTP response
```javascript
{
    "message": "Everything OK"
}
``` 