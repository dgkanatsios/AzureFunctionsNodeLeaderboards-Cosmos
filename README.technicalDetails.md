# AzureFunctionsNodeLeaderboards-Cosmos - Technical details

Details of all the operations supported in the `leaderboardsFunctionApp` Azure Function.

## POST https://**functionURL**/api/scores 
#### Description
Creates a new score. Returns the updated user's details, including top score, latest scores and number of times played. The return value contains the entire user object as well as the latest user's scores. 
#### Post body
```javascript
//createdAt is optional
//description is optional
//50 is the integer value of the score
{ "value":50, "createdAt":"2017-11-25T14:48:00", "description":"test description" }
```
#### Sample return value
```javascript
{
    "_id": "1234",
    "username": "dimitris",
    "__v": 0,
    "maxScoreValue": 12,
    "totalTimesPlayed": 2,
    "__type": "Users",
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

## GET https://**functionURL**/api/users/:userId 
#### Description
Gets a specific user's details, including top score, latest scores and number of times played.
#### Sample return value
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

## GET https://**functionURL**/api/user/scores/:count 
#### Description
Gets the top 'count' scores for logged in user sorted by score value.
#### Sample return value
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

## GET https://**functionURL**/api/scores/top/:count 
#### Description
Gets the top 'count' scores for all users for all time.
#### Sample return value
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

## GET https://**functionURL**/api/scores/today/top/:count 
#### Description
Gets the top 'count' scores for all users for today only.
#### Sample return value
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

## GET https://**functionURL**/api/users/toptotaltimesplayed/:count 
#### Description
Gets the top users for all time in regards to the times they have played (i.e. number of times they have posted a new score).
#### Sample return value
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

## GET https://**functionURL**/api/scores/latest/:count 
#### Description
Gets the latest 'count' scores.
#### Sample return value
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

## GET https://**functionURL**/api/scores/:scoreId 
#### Description
Gets the specific details of a score document.
#### Sample return value
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