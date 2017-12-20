const Score = require('../api/models/scoresModel');
const User = require('../api/models/usersModel');
const chai = require('chai');
const server = require('../index');
const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config');

chai.use(require('chai-http'));

describe('Main tests for the leaderboards API: ', function () {
    it("checks the health of the DB connection", function (done) {
        chai.request(server).get("/api/health")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("inserts a score of value 499 into the database for userID 'testUserId'", function (done) {
        chai.request(server).post("/api/scores")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .send({
                value: 499, //score value
            }).end(function (err, res) {
                console.log(JSON.stringify(err));
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("inserts another score with value 500 into the database for userID 'testUserId'", function (done) {
        chai.request(server).post("/api/scores")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .send({
                value: 500, //score value
            }).end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('checks for these two scores', function (done) {
        chai.request(server).get("/api/users/testUserId")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.totalTimesPlayed.should.equal(2);
                res.body.maxScoreValue.should.equal(500);
                res.body.latestScores.should.be.a('Array');
                res.body.latestScores.should.have.lengthOf(2);
                res.body.latestScores[0].value.should.equal(499);
                res.body.latestScores[1].value.should.equal(500);
                done();
            });
    });

    it('checks for an uknown user', function (done) {
        chai.request(server).get("/api/users/WRONG_USER_ID")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

    it("inserts a score of value 50 into the database for a new user, 'anotherUserId'", function (done) {
        chai.request(server).post("/api/scores")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .send({
                value: 50, //score value
            }).end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('inserts another 49 scores into the database for another user', function (done) {
        let promises = [];
        for (let i = 1; i < 50; i++) {
            let req = chai.request(server).post("/api/scores")
                .set('x-ms-client-principal-id', 'anotherUserId')
                .set('x-ms-client-principal-name', 'anotherUsername')
                .send({
                    value: i
                }).then(function (res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });
            promises.push(req);
        }
        Promise.all(promises).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('checks the details of anotherUser', function (done) {
        chai.request(server).get("/api/users/anotherUserId")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.totalTimesPlayed.should.equal(50);
                res.body.maxScoreValue.should.equal(50);
                res.body.latestScores.should.be.a('Array');
                res.body.latestScores.should.have.lengthOf(config.latestScoresPerUserToKeep);
                done();
            });
    });

    it("checks the scores of 'anotherUser'", function (done) {
        chai.request(server).get("/api/user/scores/10")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(10);
                res.body[0].value.should.equal(50);
                res.body[9].value.should.equal(41);
                res.body.forEach(element => {
                    element.userId.should.equal('anotherUserId');
                    element.username.should.equal('anotherUsername');
                });
                done();
            });
    });


    it("checks the result for a wront :count value", function (done) {
        chai.request(server).get("/api/user/scores/TEN")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                err.should.not.be.null;
                res.should.have.status(400);
                done();
            });
    });

    it('lists max scores achieved in the game by all users, in descending order', function (done) {
        chai.request(server).get("/api/users/maxscore/10")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(2);
                res.body[0].maxScoreValue.should.equal(500);
                res.body[1].maxScoreValue.should.equal(50);
                res.body[0].username.should.equal('testUsername');
                res.body[1].username.should.equal('anotherUsername');
                done();
            });
    });

    let justAscoreId;
    it('list top scores achieved in the game by all users, in descending order', function (done) {
        chai.request(server).get("/api/scores/top/10")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(10);
                res.body[0].value.should.equal(500);
                res.body[3].userId.should.equal('anotherUserId');
                res.body[4].username.should.equal('anotherUsername');
                res.body[9].value.should.equal(43);
                justAscoreId = res.body[9]._id;
                done();
            });
    });

    it('checks the details of a specific score', function (done) {
        chai.request(server).get(`/api/scores/${justAscoreId}`)
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.value.should.equal(43);
                done();
            });
    });

    it('lists top users based on the total times played', function (done) {
        chai.request(server).get("/api/users/toptotaltimesplayed/10")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(2);
                res.body[0]._id.should.equal('anotherUserId');
                res.body[0].username.should.equal('anotherUsername');
                res.body[1]._id.should.equal('testUserId');
                res.body[1].username.should.equal('testUsername');
                done();
            });
    });


    it('drops the test database', function (done) {
        mongoose.connection.db.dropDatabase(config.databaseNameTest, function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

});