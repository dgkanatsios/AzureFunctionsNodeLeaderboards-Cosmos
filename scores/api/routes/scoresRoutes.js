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

    app.route('/api/scores/user/:userID')
    .get(score.listAllScoresForUserID);

    app.route('/api/scores/user/latest/:userID')
    .get(score.listScoresForUserIDDateDesc);
};