'use strict';

const moment = require('moment');
const Schema = require('mongoose').Schema;
const Base = require('./baseModel');

const UserSchema = new Schema({
    userId: {
        type: String,
        required: 'Enter userId'
    },
    userName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: moment.utc()
    },
    scores: [{
        value: Number,
        score: {
            type: Schema.Types.ObjectId,
            ref: 'Scores'
        }
    }]
});

module.exports = Base.discriminator('Users', UserSchema);