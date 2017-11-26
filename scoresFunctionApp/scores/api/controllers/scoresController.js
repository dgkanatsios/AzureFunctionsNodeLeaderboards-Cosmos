'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const moment = require('moment');
const utilities = require('../../utilities');
const config = require('../../config');
const controllerHelpers = require('./controllerHelpers');

//users for all time that have played the most (i.e. have the most totalTimesPlayed)
function listTopUsersTotalTimesPlayed(req,res){
    utilities.log("listTopUsersTotalTimesPlayed",req);
    controllerHelpers.listUsers(req,res,'-totalTimesPlayed');
}

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

//top scores for all users for all time, descending
function listTopScores(req, res) {
    utilities.log("listTopScores", req);
    controllerHelpers.listScores(req, res, '-value');
};

//latest scores for all users, descending
function listLatestScores(req, res) {
    utilities.log("listLatestScores", req);
    controllerHelpers.listScores(req, res, '-createdAt');
};


//get a specific score
function getScore(req, res) {
    utilities.log("getScore", req);
    Score.findById(req.params.scoreId, config.scoreProjection).exec(function (err, score) {
        controllerHelpers.respond(err, score, res);
    });
};

//all scores for user, descending
function listAllScoresForCurrentUser(req, res) {
    utilities.log("listAllScoresForCurrentUser", req);
    //custom headers filled from authhelper.js
    let {
        userId,
        username
    } = controllerHelpers.getUserIdusername(req);
    Score.find({
        userId: userId
    }, function (err, scores) {
        controllerHelpers.respond(err, scores, res);
    }).sort('-value'); //sort on score value descending
};

//get a specific user
function getUser(req, res) {
    utilities.log("getUser", req);
    User.findById(req.params.userId, config.userProjection, function (err, user) {
        controllerHelpers.respond(err, user, res);
    });
};

function createScore(req, res) {
    utilities.log("createScore", req);

    let {
        userId,
        username
    } = controllerHelpers.getUserIdusername(req);

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
                        controllerHelpers.respond(err, '', res);
                    } else {
                        saveScore({
                            userId,
                            username
                        }, req, res);
                    }
                });
            } else {
                saveScore({
                    userId,
                    username
                }, req, res);
            }
        }).catch(function (err) {
            controllerHelpers.respond(err, null, res);
        });

};

function saveScore(user, req, res) {
    console.log(req.body.createdAt);
    const newScore = new Score({
        value: Number(req.body.value),
        description: req.body.description,
        createdAt: moment(req.body.createdAt) || moment.utc(),
        userId: user.userId,
        username: user.username
    });

    newScore.save(function (err, score) {
        const miniScoreData = {
            value: Number(req.body.value),
            score: mongoose.Types.ObjectId(score._id)
        };
        if (err) {
            controllerHelpers.respond(err, '', res);
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
                },
                $inc: {
                    totalTimesPlayed: 1
                },
            }, {
                new: true //return the updated object
            }, function (err, updatedUser) {
                controllerHelpers.respond(err, updatedUser, res);
            });
        }
    });
}



module.exports = {
    listTopScores,
    listTodayTopScores,
    listAllScoresForCurrentUser,
    listTopUsersTotalTimesPlayed,
    listLatestScores,
    createScore,
    getScore,
    getUser
}