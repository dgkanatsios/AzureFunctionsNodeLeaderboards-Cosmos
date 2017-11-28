'use strict';

const moment = require('moment');
const Schema = require('mongoose').Schema;
const Base = require('./baseModel');

const ScoreSchema = new Schema({
  value: {
    type: Number,
    required: 'Enter score value'
  },
  userId: {
    type: String,
    required: 'Enter userId'
  },
  username: {
    type: String,
    required: 'Enter username'
  },
  createdAt: {
    type: Date,
    default: moment.utc() 
    //we are not using ObjectId.getTimeStamp() to get 
    //details about score timestamp because we need to bear in mind that some of the 
    //incoming scores maybe will have been stored offline, so their creation time in our DB will
    //be different from the creation time in the client that accesses our score API
  },
  description: { //optional score related description
    type: String
  }
});

module.exports = Base.discriminator('Scores', ScoreSchema);