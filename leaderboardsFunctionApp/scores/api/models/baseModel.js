'use strict';
const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'gamedata'
}
const Base = mongoose.model('Base', new mongoose.Schema({}, baseOptions));

module.exports = Base;

//check this blog post on why Mongoose discriminators is a great option when using MongoDB API with Cosmos DB
//https://anthonychu.ca/post/cosmos-db-mongoose-discriminators/