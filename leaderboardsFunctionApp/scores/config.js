const latestScoresPerUserToKeep = 10;
const maxCountOfScoresToReturn = 10;
const maxCountOfUsersToReturn = 10;
const databaseName = 'gameDataDB';
const DEBUG_LOCAL = false;

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
    scoreProjection,
    userProjection,
    databaseName,
    DEBUG_LOCAL
};