'use strict';
module.exports = function(app) {
  const score = require('../controllers/scoresController');

  // todoList Routes
  app.route('/api/scores')
    .get(score.listAllScores)
    .post(score.createScore);


  app.route('/api/scores/:scoreId')
    .get(score.getScore)
    .put(score.updateScore);
};