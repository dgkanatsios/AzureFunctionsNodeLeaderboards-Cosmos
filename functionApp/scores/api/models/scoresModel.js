'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  createdAt: {
    type: Date,
    default: moment.utc()
  },
  value: {
    type: Number,
    required: 'Enter score value'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Scores', ScoreSchema);