'use strict';
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const moment = require('moment');
const utilities = require('../../utilities');

function respond(err, data, res) {
    if (err)
        res.send(err);
    res.json(data);
}

//all scores for all users, descending
function listAllScores(req, res) {
    utilities.log("listAllScores", req);
    Score.find({}, function (err, scores) {
        respond(err, scores, res);
    }).sort('-value');
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

//create a new score
function createScore(req, res) {
    utilities.log("createScore", req);
    const newScore = new Score(req.body);
    
    //ignore the datetime set by the client
    newScore.createdDate = moment.utc();

    newScore.save(function (err, score) {
        respond(err, score, res);
    });
};

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
    listAllScores,
    listAllScoresForUserID,
    listScoresForUserIDDateDesc,
    createScore,
    getScore,
    updateScore
}