'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const moment = require('moment');
const utilities = require('../../utilities');


//all scores for all users, descending
function listScores(req, res) {
    console.log(req.query);
    utilities.log("listAllScores", req);
    Score.find({}).limit(req.query.limit).skip(req.query.skip).sort('-value').exec(function (err, scores) {
        respond(err, scores, res);
    });
};

//all scores for user, descending
function listAllScoresForUserId(req, res) {
    utilities.log("listAllScoresForUserId", req);
    Score.find({
        userId: req.params.userId
    }, function (err, scores) {
        respond(err, scores, res);
    }).sort('-value');
};

//latest scores for user, descending
function listScoresForUserIdDateDesc(req, res) {
    utilities.log("listScoresForUserIdDateDesc", req);
    Score.find({
        userId: req.params.userId
    }, function (err, scores) {
        respond(err, scores, res);
    }).sort('-createdDate');
};

function createScore(req, res) {
    utilities.log("createScore", req);

    const userId = req.headers['CUSTOM_USERID'];
    const userName = req.headers['CUSTOM_USERNAME'];

    //check if the user exists
    User.findOne({
            userId: userId
        })
        .then(function (user) {
            if (!user) {
                //user does not exist, so let's create him/her
                const newUserID = mongoose.Types.ObjectId();
                const newUser = new User({
                    ObjectId: newUserID,
                    userId: userId,
                    userName: userName,
                    scores: []
                });
                newUser.save(function (err, user) {
                    if (err) {
                        respond(err, '', res);
                    } else {
                        saveScore(user._id, req, res);
                    }
                });
            } else {
                saveScore(user._id, req, res);
            }
        }).catch(function (err) {
            respond(err, null, res);
        });

};

function saveScore(userId, req, res) {

    const newScore = new Score({
        value: req.body.value,
        description: req.body.description,
        createdAt: moment.utc(),
        user: mongoose.Types.ObjectId(userId)
    });

    newScore.save(function (err, score) {
        if (err) {
            respond(err, '', res);
        } else {
            User.findByIdAndUpdate(userId, {
                $push: {
                    scores: {
                        value: req.body.value,
                        score: mongoose.Types.ObjectId(score._id)
                    }
                }
            }, {
                new: true
            }, function (err, updatedUser) {
                respond(err, updatedUser, res);
            });
        }
    });
}

//get a specific score
function getScore(req, res) {
    utilities.log("getScore", req);
    Score.findById(req.params.scoreId).populate('user').exec(function (err, score) {
        respond(err, score, res);
    });
};

//get a specific user
function getUser(req, res) {
    utilities.log("getUser", req);
    User.findById(req.params.userId, function (err, user) {
        respond(err, user, res);
    });
};


function respond(err, data, res) {
    if (err)
        res.status(500).send(err.message || JSON.stringify(err));
    else {
        res.json(data);
    }
}

module.exports = {
    listScores,
    listAllScoresForUserId,
    listScoresForUserIdDateDesc,
    createScore,
    getScore,
    getUser
}