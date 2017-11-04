'use strict';
const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'gamedata'
}
const Base = mongoose.model('Base', new mongoose.Schema({}, baseOptions));

module.exports = Base;

//https://anthonychu.ca/post/cosmos-db-mongoose-discriminators/