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
});