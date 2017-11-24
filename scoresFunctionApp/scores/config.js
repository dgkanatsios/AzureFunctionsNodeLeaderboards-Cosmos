const latestScoresPerUserToKeep = 10;
const maxCountOfScoresToReturn = 10;
const DEBUG_LOCAL = true;

const scoreProjection = { 
    __v: 0,
    _id: 0,
    __type:0
};

const userProjection = { 
    __v: 0,
    _id: 0,
    __type:0
};

module.exports = {
    latestScoresPerUserToKeep,
    maxCountOfScoresToReturn,
    scoreProjection,
    userProjection,
    DEBUG_LOCAL
};