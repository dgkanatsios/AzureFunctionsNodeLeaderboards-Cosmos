'use strict';
const config = require('../../config');
const mongoose = require('mongoose');
const Score = mongoose.model('Scores');
const User = mongoose.model('Users');
const utilities = require('../../utilities');

function listUsers(req, res, sortByValue, queryFilter) {
    listDocuments(req, res, sortByValue, queryFilter, User, config.maxCountOfUsersToReturn, config.userProjection);
}

function listScores(req, res, sortByValue, queryFilter) {
    listDocuments(req, res, sortByValue, queryFilter, Score, config.maxCountOfScoresToReturn, config.scoreProjection);
}

function listDocuments(req, res, sortByValue, queryFilter, schemaName, maxCount, projection) {
    const count = utilities.getInteger(req.params.count);
    if (isNaN(count) || count < 1 || count > maxCount) {
        const err = `count must be between 1 and ${maxCount}`;
        respond(err, null, res, 400);
    } else {
        const _filter = queryFilter || {};
        schemaName.find(_filter, projection).limit(count).sort(sortByValue).exec(function (err, scores) {
            respond(err, scores, res);
        });
    }
}

function respond(error, data, res, httpStatus) {
    if (error) {
        httpStatus = httpStatus || 500;
        res.status(httpStatus).json({error});
    } else {
        if (data)
            res.json(data);
        else
            res.status(400).json({error:'No data found for your GET/POST arguments'});
    }
}

//parses userId, username from custom headers
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