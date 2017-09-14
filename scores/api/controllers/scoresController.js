'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const moment = require('moment');
const utilities = require('../../utilities');


function respond(err, data, res) {
    if (err)
        res.status(500).send(err);
    else {
        res.json(data);
    }
}

//all scores for all users, descending
function listScores(req, res) {
    console.log(req.query);
    utilities.log("listAllScores", req);
    Score.find({}).limit(req.query.limit).skip(req.query.skip).sort('-value').exec(function (err, scores) {
        respond(err, scores, res);
    });
};

//all scores for user, descending
function listAllScoresForUserID(req, res) {
    utilities.log("listAllScoresForUserID", req);
    Score.find({
        'userID': req.params.userID
    }, function (err, scores) {
        respond(err, scores, res);
    }).sort('-value');
};

//latest scores for user, descending
function listScoresForUserIDDateDesc(req, res) {
    utilities.log("listScoresForUserIDDateDesc", req);
    Score.find({
        'userID': req.params.userID
    }, function (err, scores) {
        respond(err, scores, res);
    }).sort('-createdDate');
};

function createScore(req, res) {
    utilities.log("createScore", req);

    //check if the user exists
    const userId = req.headers['x-ms-client-principal-id'];
    const userName = req.headers['x-ms-client-principal-name'];

    User.findOne({
        userId: userId
    }).then(function (user) {
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
                    respond(JSON.stringify(err), '', res);
                } else {
                    saveScore(user._id, req, res);
                }
            });
        } else {
            saveScore(user._id, req, res);
        }
    }).catch(function (err) {
        respond(JSON.stringify(err), null, res);
    });

};

function saveScore(userId, req, res) {
    
    const newScore = new Score({
        value: req.body.value,
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
    Score.findById(req.params.scoreId, function (err, score) {
        respond(err, score, res);
    });
};

//update score
function updateScore(req, res) {
    utilities.log("updateScore", req);
    Score.findOneAndUpdate({
        _id: req.params.scoreId
    }, req.body, {
        new: true
    }, function (err, score) {
        respond(err, score, res);
    });
};

module.exports = {
    listScores,
    listAllScoresForUserID,
    listScoresForUserIDDateDesc,
    createScore,
    getScore,
    updateScore
}