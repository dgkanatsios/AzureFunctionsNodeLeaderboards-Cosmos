'use strict';
module.exports = function (app) {
  const leaderboardsAPI = require('../controllers/leaderboardsController');

  app.route('/api/scores')
    .post(leaderboardsAPI.createScore);

  app.route('/api/scores/top/:count')
    .get(leaderboardsAPI.listTopScores);

  app.route('/api/scores/top/today/:count')
    .get(leaderboardsAPI.listTodayTopScores);

  app.route('/api/users/maxscore/:count')
    .get(leaderboardsAPI.listTopScorePerUser);

  app.route('/api/scores/latest/:count')
    .get(leaderboardsAPI.listLatestScores);

  app.route('/api/scores/:scoreId')
    .get(leaderboardsAPI.getScore);

  app.route('/api/users/:userId')
    .get(leaderboardsAPI.getUser);

  app.route('/api/users/toptotaltimesplayed/:count')
    .get(leaderboardsAPI.listTopUsersTotalTimesPlayed);

  app.route('/api/user/scores/:count')
    .get(leaderboardsAPI.listScoresForCurrentUser);

  app.route('/api/health')
    .get(leaderboardsAPI.checkDBhealth);

};