'use strict';
const config = require('../../config');
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');

function listUsers(req, res, sortByValue, filter) {
    const count = Number(req.params.count) || 10;
    if (count < 1 || count > config.maxCountOfScoresToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfUsersToReturn}`;
        respond(err, null, res);
    } else {
        const _filter = filter || {};
        User.find(_filter, config.minimalUserProjection).sort(sortByValue).limit(count).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

function listScores(req, res, sortByValue, filter) {
    const count = Number(req.params.count) || 10;
    if (count < 1 || count > config.maxCountOfScoresToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfScoresToReturn}`;
        respond(err, null, res);
    } else {
        const _filter = filter || {};
        Score.find(_filter, config.scoreProjection).sort(sortByValue).limit(count).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

function respond(err, data, res) {
    if (err)
        res.status(500).send(err.message || JSON.stringify(err));
    else {
        res.json(data);
    }
}

function getUserIdusername(req) {
    //custom headers filled from authhelper.js
    const userId = req.headers['CUSTOM_USERID'];
    const username = req.headers['CUSTOM_username'];
    return {
        userId,
        username
    };
}

module.exports = {
    listUsers,
    listScores,
    respond,
    getUserIdusername
}