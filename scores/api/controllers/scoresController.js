'use strict';
const mongoose = require('mongoose'),
    Score = mongoose.model('Scores');
const utilities = require('../../utilities');

function respond(err, data, res) {
    if (err)
        res.send(err);
    res.json(data);
}

function listAllScores(req, res) {
    utilities.log("listAllScores", req);
    Score.find({}, function (err, scores) {
        respond(err, scores, res);
    });
};

function listAllScoresForUserID(req, res) {
    utilities.log("listAllScoresForUserID", req);
    Score.find({
        'userID': req.params.userID
    }, function (err, scores) {
        respond(err, scores, res);
    });
};

function createScore(req, res) {
    utilities.log("createScore", req);
    const newScore = new Score(req.body);
    newScore.save(function (err, score) {
        respond(err, score, res);
    });
};


function getScore(req, res) {
    utilities.log("getScore", req);
    Score.findById(req.params.scoreId, function (err, score) {
        respond(err, score, res);
    });
};


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
    createScore,
    getScore,
    updateScore
}