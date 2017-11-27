'use strict';
const config = require('../../config');
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const utilities = require('../../utilities');

function listUsers(req, res, sortByValue, queryFilter) {
    const count = utilities.getInteger(req.params.count);
    if (isNaN(count) || count < 1 || count > config.maxCountOfScoresToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfUsersToReturn}`;
        respond(err, null, res, 400);
    } else {
        const _filter = queryFilter || {};
        User.find(_filter, config.minimalUserProjection).sort(sortByValue).limit(count).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

function listScores(req, res, sortByValue, queryFilter) {
    const count = utilities.getInteger(req.params.count);
    if (isNaN(count) || count < 1 || count > config.maxCountOfScoresToReturn) {
        const err = `count must be between 1 and ${config.maxCountOfScoresToReturn}`;
        respond(err, null, res, 400);
    } else {
        const _filter = queryFilter || {};
        Score.find(_filter, config.scoreProjection).sort(sortByValue).limit(count).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

function respond(error, data, res, httpStatus) {
    if (error) {
        httpStatus = httpStatus || 500;
        res.status(httpStatus).send(error.message || JSON.stringify(error));
    } else {
        if (data)
            res.json(data);
        else
            res.status(400).send('No data found for your arguments');
    }
}

function getUserIdusername(req) {
    //custom headers filled from authhelper.js
    const userId = req.headers['CUSTOM_USERID'];
    const username = req.headers['CUSTOM_USERNAME'];
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