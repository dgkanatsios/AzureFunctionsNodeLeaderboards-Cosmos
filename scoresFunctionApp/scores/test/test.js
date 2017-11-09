const Score = require('../api/models/scoresModel');
const User = require('../api/models/usersModel');
const chai = require('chai');
const server = require('../index');
const should = chai.should();
const mongoose = require('mongoose');
const utilities = require('../utilities');

chai.use(require('chai-http'));

utilities.DEBUG_GLOBAL = false;

describe('scores', function () {

    let userId;
    it("inserts a score of value 500 into the database for userID 'myTestPrincipalId'", function (done) {
        chai.request(server).post("/api/scores").set('x-ms-client-principal-id', 'myTestPrincipalId')
            .set('x-ms-client-principal-name', 'myTestPrincipalname').send({
                value: 500 //score value
            }).end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                userId = res.body.userId;
                done();
            });
    });

    it("inserts another score with value 499 into the database for userID 'myTestPrincipalId'", function (done) {
        chai.request(server).post("/api/scores").set('x-ms-client-principal-id', 'myTestPrincipalId')
            .set('x-ms-client-principal-name', 'myTestPrincipalname').send({
                value: 499 //score value
            }).end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                if (res.body.userId !== userId) //compare the userID with the previous one. They must be the same
                    throw new Error('Different userId');
                done();
            });
    });

    it('checks for these two scores', function (done) {
        chai.request(server).get(`/api/scores/user/latest/${userId}`).set('x-ms-client-principal-id', 'testPrincipalId')
            .set('x-ms-client-principal-name', 'testPrincipalname')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.scores.should.be.a('Array');
                res.body.scores.should.have.lengthOf(2);
                res.body.scores[0].should.be(499);
                res.body.scores[0].should.be(500);
                done();
            });
    });
return;
    it('inserts 100 items into the database', function (done) {
        let promises = [];
        for (let i = 0; i < 100; i++) {
            let req = chai.request(server).post("/api/scores").set('x-ms-client-principal-id', 'testPrincipalId' + i)
                .set('x-ms-client-principal-name', 'testPrincipalname' + i).send({
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
            console.log(err);
            done(err);
        });
    });



    // it('queries the database 10 times', function (done) {
    //     let promises = [];
    //     for (let i = 0; i < 10; i++) {
    //         let req = chai.request(server).get(`/api/scores?skip=${i*10}&limit=10`).then(function (res) {
    //             res.should.have.status(200);
    //             res.body.should.be.a('Array');

    //             const resultArray = res.body;
    //             const actualMembers = [];
    //             resultArray.forEach(function (e) {
    //                 actualMembers.push(e.value);
    //             });

    //             const expectedMembers = [];
    //             for(let j=0;j<10;j++){
    //                 expectedMembers.push((10 - i) * 10 - j - 1);
    //             }

    //             actualMembers.should.have.members(expectedMembers);

    //         }).catch(function (err) {
    //             console.log(err);
    //             throw err;
    //         });
    //         promises.push(req);
    //     }
    //     Promise.all(promises).then(function () {
    //         done();
    //     }).catch(function (err) {
    //         console.log(err);
    //         done(err);
    //     });
    // });


    it('deletes the gamedata collection', function (done) {
        mongoose.connection.db.dropCollection('gamedata', function (err) {
            if (err) {
                console.log(err);
                done(err);
            } else {
                done();
            }
        });
    });

});