'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ScoreSchema = new Schema({
  userID: {
    type: String,
    required: 'Enter userID'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number,
    required: 'Enter score value'
  }
});

module.exports = mongoose.model('Scores', ScoreSchema);