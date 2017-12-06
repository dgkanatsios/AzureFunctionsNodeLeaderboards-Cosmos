'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const moment = require('moment');
const utilities = require('../../utilities');
const config = require('../../config');
const controllerHelpers = require('./controllerHelpers');

//https://**functionURL**/api/users/toptotaltimesplayed
//users for all time that have played the most (i.e. have the most totalTimesPlayed)
function listTopUsersTotalTimesPlayed(req, res) {
    utilities.log("listTopUsersTotalTimesPlayed", req);
    controllerHelpers.listUsers(req, res, '-totalTimesPlayed');
}

//https://**functionURL**/api/scores/today/top/:count
//top scores for all users for today, descending
function listTodayTopScores(req, res) {
    utilities.log("listTodayTopScores", req);
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    controllerHelpers.listScores(req, res, '-value', {
        createdAt: {
            $gte: start,
            $lt: end
        }
    });
};

//https://**functionURL**/api/user/scores/:count
//all scores for user, descending
function listScoresForCurrentUser(req, res) {
    utilities.log("listScoresForCurrentUser", req);
    //custom headers filled from authhelper.js
    let {
        userId,
        username
    } = controllerHelpers.getUserIdusername(req);
    controllerHelpers.listScores(req, res, '-value', {
        userId: userId
    });
};

//https://**functionURL**/api/scores/top/:count
//top scores achieved in the game by all users, in descending order. This can include more than one top score per user
function listTopScores(req, res) {
    utilities.log("listTopScores", req);
    controllerHelpers.listScores(req, res, '-value');
};

//https://**functionURL**/api/users/maxscore/:count
//lists all the max scores achieved in the game by all users, in descending order.
//practically this includes the max score per user in descending order
function listTopScorePerUser(req, res) {
    utilities.log("listTopScorePerUser", req);
    controllerHelpers.listUsers(req, res, '-maxScoreValue');
};

//https://**functionURL**/api/scores/latest/:count
//latest scores for all users, descending
function listLatestScores(req, res) {
    utilities.log("listLatestScores", req);
    controllerHelpers.listScores(req, res, '-createdAt');
};

//https://**functionURL**/api/scores/:scoreID
//get a specific score
function getScore(req, res) {
    utilities.log("getScore", req);
    Score.findById(req.params.scoreId, config.scoreProjection).exec(function (err, score) {
        controllerHelpers.respond(err, score, res);
    });
};

//https://**functionURL**/api/users/:userId
//get a specific user
function getUser(req, res) {
    utilities.log("getUser", req);
    User.findById(req.params.userId, config.userProjection, function (err, user) {
        controllerHelpers.respond(err, user, res);
    });
};

//https://**functionURL**/api/scores
//creates a new score. If the user that got the score doesn't exist (new user), he/she is created, too
function createScore(req, res) {
    utilities.log("createScore", req);

    let {
        userId,
        username
    } = controllerHelpers.getUserIdusername(req);

    //validate score
    const scoreValue = utilities.getInteger(req.body.value);
    if (isNaN(scoreValue) || scoreValue < 0) {
        controllerHelpers.respond('score value must be an integer', '', res, 400);
    }

    //check if the user exists
    User.findById(userId)
        .then(function (user) {
            if (!user) {
                //user does not exist, so let's create him/her
                const newUser = new User({
                    _id: userId,
                    username: username,
                    scores: []
                });
                newUser.save(function (err, user) {
                    if (err) {
                        controllerHelpers.respond('Error in creating new user: ' + err, null, res);
                    } else { //user was created, save the new score
                        saveScore({
                            userId,
                            username
                        }, req, res);
                    }
                });
            } else { //user exists, so just save the new score
                saveScore({
                    userId,
                    username
                }, req, res);
            }
        }).catch(function (err) {
            controllerHelpers.respond('Error in creating/updating  user: ' + err, null, res);
        });

};


//https://**functionURL**/api/users/rankamong/:userId/:count
function userRankAmong(req, res) {
    //based on the implementation suggested here
    //https://stackoverflow.com/questions/9992750/rank-leaderboard-in-mongo-with-surrounding-players
    utilities.log("userRankAmong");
    const count = utilities.getInteger(req.params.count);
    if (isNaN(count) || count < 1 || count > config.maxCountOfUsersToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfUsersToReturn}`;
        controllerHelpers.respond(err, null, res, 400);
    } else {
        let user, nextPlayerResult;
        User.findById(req.params.userId, config.userProjection) //find the current player
            .then(_user => { //find the ones better than the current
                user = _user;
                return User.find({
                    _id: {
                        $ne: user._id
                    },
                    maxScoreValue: {
                        $gte: user.maxScoreValue
                    }
                }).sort({
                    maxScoreValue: -1,
                    username: 1
                }).limit(count);
            })
            .then(_nextPlayerResult => {
                nextPlayerResult = _nextPlayerResult;
                return User.find({ //find the ones worse than the current
                    _id: {
                        $ne: user._id
                    },
                    maxScoreValue: {
                        $lte: user.maxScoreValue
                    }
                }).sort({
                    maxScoreValue: -1,
                    username: -1
                }).limit(count)
            })
            .then(previousPlayerResult => {
                //utilities.log(previousPlayerResult.length);
                //utilities.log(nextPlayerResult.length);
                //send the result
                controllerHelpers.respond(null, [
                    ...nextPlayerResult,
                    user,
                    ...previousPlayerResult
                ], res);

            }).catch(error => {
                utilities.log(error);
                controllerHelpers.respond(error.message || error, '', res);
            });
    }
}

//helper function to save the score in the database
function saveScore(user, req, res) {
    const newScore = new Score({
        value: Number(req.body.value),
        description: req.body.description,
        createdAt: moment(req.body.createdAt) || moment.utc(),
        userId: user.userId,
        username: user.username
    });

    newScore.save(function (err, score) {
        if (err) {
            controllerHelpers.respond('Error in creating new score: ' + err, null, res);
        } else {
            const miniScoreData = {
                value: Number(req.body.value),
                score: mongoose.Types.ObjectId(score._id)
            };
            User.findByIdAndUpdate(user.userId, {
                $push: {
                    latestScores: {
                        $each: [miniScoreData],
                        $slice: -config.latestScoresPerUserToKeep //minus because we want the last 10 elements
                    }
                },
                $max: {
                    maxScoreValue: miniScoreData.value
                },
                $inc: {
                    totalTimesPlayed: 1
                },
            }, {
                new: true //return the updated object
            }, function (err, updatedUser) {
                if (err)
                    controllerHelpers.respond('Error in updating user with new score: ' + err, '', res);
                else
                    controllerHelpers.respond(null, updatedUser, res);
            });
        }
    });
}

//https://**functionURL**/api/health
function checkDBhealth(req, res) {
    utilities.mongoConnect(mongoose)
        .then(
            () => {
                controllerHelpers.respond(null, "Everything OK", res);
            },
            err => {
                controllerHelpers.respond('Error' + err, null, res, 500);
            }
        )
}

module.exports = {
    listTopScores,
    listTodayTopScores,
    listScoresForCurrentUser,
    listTopUsersTotalTimesPlayed,
    listTopScorePerUser,
    listLatestScores,
    createScore,
    getScore,
    getUser,
    userRankAmong,
    checkDBhealth
}