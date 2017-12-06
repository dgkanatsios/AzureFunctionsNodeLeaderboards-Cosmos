const Score = require('../api/models/scoresModel');
const User = require('../api/models/usersModel');
const chai = require('chai');
const server = require('../index');
const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config');

chai.use(require('chai-http'));

describe('Rank tests for the leaderboards API: ', function () {
    it("checks the health of the DB connection", function (done) {
        chai.request(server).get("/api/health")
            .set('x-ms-client-principal-id', 'testUserId')
            .set('x-ms-client-principal-name', 'testUsername')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('string');
                done();
            });
    });

    it('inserts another 25 scores into the database for 25 different users', function (done) {
        let promises = [];
        for (let i = 1; i <= 25; i++) {
            let req = chai.request(server).post("/api/scores")
                .set('x-ms-client-principal-id', `userId${i}`)
                .set('x-ms-client-principal-name', `username${i}`)
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

    it('checks the rank of userId5', function (done) {
        chai.request(server).get('/api/users/rankamong/userId5/1')
            .set('x-ms-client-principal-id', 'userId1')
            .set('x-ms-client-principal-name', '1')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(3);
                res.body[0].maxScoreValue.should.equal(6);
                res.body[1].maxScoreValue.should.equal(5);
                res.body[2].maxScoreValue.should.equal(4);
                done();
            });
    });

    it('checks the rank of userId10', function (done) {
        chai.request(server).get('/api/users/rankamong/userId10/2')
            .set('x-ms-client-principal-id', 'userId1')
            .set('x-ms-client-principal-name', '1')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(5);
                res.body[0].maxScoreValue.should.equal(12);
                res.body[1].maxScoreValue.should.equal(11);
                res.body[2].maxScoreValue.should.equal(10);
                res.body[3].maxScoreValue.should.equal(9);
                res.body[4].maxScoreValue.should.equal(8);
                done();
            });
    });

    it('checks the rank of userId20', function (done) {
        chai.request(server).get('/api/users/rankamong/userId20/3')
            .set('x-ms-client-principal-id', 'userId1')
            .set('x-ms-client-principal-name', '1')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(7);
                res.body[0].maxScoreValue.should.equal(23);
                res.body[1].maxScoreValue.should.equal(22);
                res.body[2].maxScoreValue.should.equal(21);
                res.body[3].maxScoreValue.should.equal(20);
                res.body[4].maxScoreValue.should.equal(19);
                res.body[5].maxScoreValue.should.equal(18);
                res.body[6].maxScoreValue.should.equal(17);
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