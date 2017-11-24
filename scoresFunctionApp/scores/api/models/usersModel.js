'use strict';

const moment = require('moment');
const Schema = require('mongoose').Schema;
const Base = require('./baseModel');

const UserSchema = new Schema({
    _id:{
        type: String
    },
    userName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: moment.utc()
    },
    latestScores: [{
        value: Number,
        score: {
            type: Schema.Types.ObjectId,
            ref: 'Scores'
        }
    }],
    topScores: [{
        value: Number,
        score: {
            type: Schema.Types.ObjectId,
            ref: 'Scores'
        }
    }]
});

module.exports = Base.discriminator('Users', UserSchema);