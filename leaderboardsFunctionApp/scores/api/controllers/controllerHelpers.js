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

    let skipCount = req.query.skip || 0;
    skipCount = utilities.getInteger(skipCount);

    if (isNaN(count) || count < 1 || count > maxCount) {
        const err = `count must be between 1 and ${maxCount}`;
        respond(err, null, req, res, 400);
    } else if (isNaN(skipCount) || skipCount < 0) {
        const err = `skip must be >= 0`;
        respond(err, null, req, res, 400);
    } else {
        const _filter = queryFilter || {};

        schemaName.aggregate([{
                $match: _filter
            },
            {
                $project: {
                    value: 1,
                    userId: 1,
                    username: 1
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: 1
                    },
                    posts: {
                        $push: {
                            value: '$value'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    posts: {
                        $slice: ['$posts', skipCount, count]
                    }

                }
            }
        ], function (err, result) {
            console.log(err);
            if (result)
                respond(err, result[0], req, res); //we use [0] because normally it returns an array with one element
            else
                respond('No data for your arguments/credentials', null, req, res, 400);
        });
    }
}

function respond(error, data, req, res, httpStatus) {
    if (error) {
        httpStatus = httpStatus || 500;
        utilities.logError(JSON.stringify(error), req);
        res.status(httpStatus).json({
            error
        });
    } else {
        if (data)
            res.json(data);
        else {
            const errorMessage = 'No data found for your arguments/credentials';
            utilities.logError(JSON.stringify(errorMessage), req);
            res.status(400).json({
                error: errorMessage
            });
        }
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