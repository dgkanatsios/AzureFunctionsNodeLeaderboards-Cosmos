'use strict';
module.exports = function (app) {
  const score = require('../controllers/scoresController');

  // todoList Routes
  app.route('/api/scores')
    .get(score.listScores)
    .post(score.createScore);


  app.route('/api/scores/:scoreId')
    .get(score.getScore);

  app.route('/api/users/:userId')
    .get(score.getUser);

  app.route('/api/user/:userID')
    .get(score.listAllScoresForUserID);

  app.route('/api/scores/user/latest/:userID')
    .get(score.listScoresForUserIDDateDesc);
};