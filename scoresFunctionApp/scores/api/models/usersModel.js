'use strict';

const moment = require('moment');
const Schema = require('mongoose').Schema;
const Base = require('./baseModel');

const UserSchema = new Schema({
    _id:{
        type: String,
        required: '_id is required'
    },
    username: {
        type: String,
        required: 'username is required'
    },
    createdAt: {
        type: Date,
        default: moment.utc()
    },
    maxScoreValue:{
        type: Number
    },
    totalTimesPlayed:{
        type: Number
    },
    latestScores: [{
        value: Number,
        score: {
            type: Schema.Types.ObjectId,
            ref: 'Scores'
        }
    }]
});

module.exports = Base.discriminator('Users', UserSchema);