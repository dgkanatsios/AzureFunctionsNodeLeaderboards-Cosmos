const latestScoresPerUserToKeep = 10; 
const maxCountOfScoresToReturn = 10;
const maxCountOfUsersToReturn = 10;
const maxBetterOrWorseSurroundingUsersToReturn = 5; //used in the surroundingByScore operation
const databaseName = 'gameDataDB';
const databaseNameTest = 'gameDataDBTEST';
const DEBUG_LOCAL = true;

const scoreProjection = { 
    __v: 0,
     __type:0
};

const userProjection = { 
    __v: 0,
    __type:0
};


module.exports = {
    latestScoresPerUserToKeep,
    maxCountOfScoresToReturn,
    maxCountOfUsersToReturn,
    maxBetterOrWorseSurroundingUsersToReturn,
    scoreProjection,
    userProjection,
    databaseName,
    databaseNameTest,
    DEBUG_LOCAL
};