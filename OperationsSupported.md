# Operations supported

Details of all the operations supported in this Azure Function.

### POST https://**functionURL**/api/scores -> createScore method in gameDataController.js
#### Description
Creates a new score. Returns the updated user's details, including top score, latest scores and number of times played.
#### Post body
```javascript
{ "value":`Integer value of the score` }
```
#### Sample return value
```javascript
{
    "_id": "1234",
    "userName": "dimitris",
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

### GET https://**functionURL**/api/users/:userId -> getUser method in gameDataController.js
#### Description
Gets a specific user's details, including top score, latest scores and number of times played.
#### Sample return value
```javascript
{
    "userName": "dimitris",
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