# Operations supported

Details of all the operations supported in this Azure Function.

### POST https://**functionURL**/api/scores -> createScore method in scoresController.js
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

### GET https://**functionURL**/api/users/:userId -> getUser method in scoresController.js
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