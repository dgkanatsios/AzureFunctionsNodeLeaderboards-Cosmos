const Score = require('../api/models/scoresModel');
const scoresController = require('../api/controllers/scoresController.js');
const chai = require('chai');
const server = require('../index');
const should = chai.should();
const mongoose = require('mongoose');

chai.use(require('chai-http'));

describe('scores', function () {
    it('inserts 100 items into the database', function (done) {
        let promises = [];
        for (let i = 0; i < 100; i++) {
            let req = chai.request(server).post("/api/scores").send({
                userID: i.toString() + "dgkanatsios",
                value: i
            }).then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
            }).catch(function (err) {
                console.log(err);
                throw err;
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


    // it('deletes the score collection', function (done) {
    //     mongoose.connection.db.dropCollection('scores', function (err) {
    //         if (err) {
    //             console.log(err);
    //             done(err);
    //         } else {
    //             done();
    //         }
    //     });
    // });
});