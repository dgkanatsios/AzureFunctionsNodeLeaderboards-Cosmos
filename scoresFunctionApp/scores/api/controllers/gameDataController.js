'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const moment = require('moment');
const utilities = require('../../utilities');
const config = require('../../config');


//top scores for all users, descending
function listTopScores(req, res) {
    utilities.log("listTopScores", req);
    listScores(req,res,'-value');
};

//latest scores for all users, descending
function listLatestScores(req, res) {
    utilities.log("listLatestScores", req);
    listScores(req,res,'-createdAt');
};

function listScores(req,res,sortByValue){
    const count = Number(req.params.count) || 10;
    if (count < 1 || count > config.maxCountOfScoresToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfScoresToReturn}`;
        respond(err, null, res);
    } else {
        Score.find({}, config.scoreProjection).sort(sortByValue).limit(count).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

//get a specific score
function getScore(req, res) {
    utilities.log("getScore", req);
    Score.findById(req.params.scoreId, config.scoreProjection).exec(function (err, score) {
        respond(err, score, res);
    });
};

//all scores for user, descending
function listAllScoresForCurrentUser(req, res) {
    utilities.log("listAllScoresForCurrentUser", req);
    //custom headers filled from authhelper.js
    let {
        userId,
        userName
    } = getUserIdUserName(req);
    Score.find({
        userId: userId
    }, function (err, scores) {
        respond(err, scores, res);
    }).sort('-value'); //sort on score value descending
};

//get a specific user
function getUser(req, res) {
    utilities.log("getUser", req);
    User.findById(req.params.userId, config.userProjection, function (err, user) {
        respond(err, user, res);
    });
};

// //latest scores for user, descending
// function listScoresForUserIdDateDesc(req, res) {
//     utilities.log("listScoresForUserIdDateDesc", req);
//     Score.find({
//         userId: req.params.userId
//     }, function (err, scores) {
//         respond(err, scores, res);
//     }).sort('-createdDate');
// };

function createScore(req, res) {
    utilities.log("createScore", req);

    let {
        userId,
        userName
    } = getUserIdUserName(req);

    //check if the user exists
    User.findById(userId)
        .then(function (user) {
            if (!user) {
                //user does not exist, so let's create him/her
                const newUser = new User({
                    _id: userId,
                    userName: userName,
                    scores: []
                });
                newUser.save(function (err, user) {
                    if (err) {
                        respond(err, '', res);
                    } else {
                        saveScore({userId,userName}, req, res);
                    }
                });
            } else {
                saveScore({userId,userName}, req, res);
            }
        }).catch(function (err) {
            respond(err, null, res);
        });

};

function saveScore(user, req, res) {
    const newScore = new Score({
        value: Number(req.body.value),
        description: req.body.description,
        createdAt: moment.utc(),
        userId: user.userId,
        userName: user.userName
    });

    newScore.save(function (err, score) {
        const miniScoreData = {
            value: Number(req.body.value),
            score: mongoose.Types.ObjectId(score._id)
        };
        if (err) {
            respond(err, '', res);
        } else {
            User.findByIdAndUpdate(user.userId, {
                $push: {
                    latestScores: {
                        $each: [miniScoreData],
                        $slice: -config.latestScoresPerUserToKeep //minus because we want the last 10 elements
                    }
                },
                $max: {
                    maxScoreValue: miniScoreData.value
                }
            }, {
                new: true //return the updated object
            }, function (err, updatedUser) {
                respond(err, updatedUser, res);
            });
        }
    });
}

function respond(err, data, res) {
    if (err)
        res.status(500).send(err.message || JSON.stringify(err));
    else {
        res.json(data);
    }
}

function getUserIdUserName(req) {
    //custom headers filled from authhelper.js
    const userId = req.headers['CUSTOM_USERID'];
    const userName = req.headers['CUSTOM_USERNAME'];
    return {
        userId,
        userName
    };
}

module.exports = {
    listTopScores,
    listAllScoresForCurrentUser,
    listLatestScores,
    createScore,
    getScore,
    getUser
}