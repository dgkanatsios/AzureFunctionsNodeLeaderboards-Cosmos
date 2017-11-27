const Score = require('../api/models/scoresModel');
const User = require('../api/models/usersModel');
const chai = require('chai');
const server = require('../index');
const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
const utilities = require('../utilities');
const config = require('../config');

chai.use(require('chai-http'));

utilities.DEBUG_GLOBAL = true;

describe('Tests for the scores API', function () {


    it("inserts a score of value 500 into the database for userID 'testUserId'", function (done) {
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

    it("inserts another score with value 499 into the database for userID 'testUserId'", function (done) {
        chai.request(server).post("/api/scores")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .send({
                value: 499, //score value
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
                res.body.latestScores[0].value.should.equal(500);
                res.body.latestScores[1].value.should.equal(499);
                done();
            });
    });

    it('checks for an uknown user', function (done) {
        chai.request(server).get("/api/users/WrongUserId")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

    it("inserts a score of value 101 into the database for a new user, 'anotherUserId'", function (done) {
        chai.request(server).post("/api/scores")
            .set('x-ms-client-principal-id', 'anotherUserId')
            .set('x-ms-client-principal-name', 'anotherUsername')
            .send({
                value: 100, //score value
            }).end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('inserts another 99 scores into the database for another user', function (done) {
        let promises = [];
        for (let i = 1; i < 100; i++) {
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
                res.body.totalTimesPlayed.should.equal(100);
                res.body.maxScoreValue.should.equal(100);
                res.body.latestScores.should.be.a('Array');
                res.body.latestScores.should.have.lengthOf(config.latestScoresPerUserToKeep);
                done();
            });
    });

    it('deletes the gamedata collection', function (done) {
        mongoose.connection.db.dropCollection('gamedata', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

});