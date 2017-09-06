'use strict';


const mongoose = require('mongoose'),
  Score = mongoose.model('Scores');

exports.listAllScores = function(req, res) {
    Score.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};




exports.createScore = function(req, res) {
  const newScore = new Score(req.body);
  newScore.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.getScore = function(req, res) {
  Score.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.updateScore = function(req, res) {
    Score.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
