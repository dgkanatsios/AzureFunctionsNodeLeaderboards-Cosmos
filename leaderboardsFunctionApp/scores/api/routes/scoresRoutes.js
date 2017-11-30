'use strict';
module.exports = function (app) {
  const score = require('../controllers/scoresController');

  // todoList Routes
  app.route('/api/scores')
    .post(score.createScore);

  app.route('/api/scores/top/:count')
    .get(score.listTopScores);

  app.route('/api/scores/top/today/:count')
    .get(score.listTodayTopScores);

  app.route('/api/scores/latest/:count')
    .get(score.listLatestScores);

  app.route('/api/scores/:scoreId')
    .get(score.getScore);

  app.route('/api/users/:userId')
    .get(score.getUser);

  app.route('/api/users/toptotaltimesplayed/:count')
    .get(score.listTopUsersTotalTimesPlayed);

  app.route('/api/user/scores/:count')
    .get(score.listScoresForCurrentUser);

};