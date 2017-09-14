'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;


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

module.exports = mongoose.model('Users', UserSchema);