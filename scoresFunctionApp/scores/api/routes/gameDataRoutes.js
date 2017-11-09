'use strict';
module.exports = function (app) {
  const score = require('../controllers/gameDataController');

  // todoList Routes
  app.route('/api/scores')
    .get(score.listScores)
    .post(score.createScore);


  app.route('/api/scores/:scoreId')
    .get(score.getScore);

  app.route('/api/users/:userId')
    .get(score.getUser);

  app.route('/api/user/:userId')
    .get(score.listAllScoresForUserId);

  app.route('/api/scores/user/latest/:userId')
    .get(score.listScoresForUserIdDateDesc);
};