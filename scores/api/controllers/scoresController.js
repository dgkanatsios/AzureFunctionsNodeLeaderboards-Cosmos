'use strict';
const mongoose = require('mongoose'),
    Score = mongoose.model('Scores');
const utilities = require('../../utilities');

exports.listAllScores = function (req, res) {
    utilities.log(req, "listAllScores");
    Score.find({}, function (err, score) {
        if (err)
            res.send(err);
        res.json(score);
    });
};

exports.createScore = function (req, res) {
    utilities.log(req, "createScore");
    const newScore = new Score(req.body);
    newScore.save(function (err, score) {
        if (err)
            res.send(err);
        res.json(score);
    });
};


exports.getScore = function (req, res) {
    utilities.log(req, "getScore");
    Score.findById(req.params.scoreId, function (err, score) {
        if (err)
            res.send(err);
        res.json(score);
    });
};


exports.updateScore = function (req, res) {
    utilities.log(req, "updateScore");
    Score.findOneAndUpdate({
        _id: req.params.scoreId
    }, req.body, {
        new: true
    }, function (err, score) {
        if (err)
            res.send(err);
        res.json(score);
    });
};