'use strict';

var fs = require('fs');
var expect = require("chai").expect;

var sinon = require('sinon');
var pointService = require('../services/pointService');
var fifa = require('../services/fifa');

describe('Point service', function () {
    describe('calculating match points', function () {
        var match;

        beforeEach(function () {
            match = {
                team1_id: 1,
                team2_id: 2,
                fullTimeScore1: 0,
                fullTimeScore2: 0,
                extraTimeScore1: 0,
                extraTimeScore2: 0,
                penaltyScore1: 0,
                penaltyScore2: 0,
                winner: 0,
                matchType: "GROUP"
            }
        });

        it('should detect draw and clean sheet for team 1', function () {
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(12);
        });

        it('should detect draw and clean sheet for team 2', function () {
            expect(pointService.getMatchPointsForTeam(match, 2)).to.equal(12);
        });

        it('should detect win and clean sheet for team 1', function () {
            match.winner = 1;
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(20);
        });

        it('should detect win and clean sheet for team 2', function () {
            match.winner = 2;
            expect(pointService.getMatchPointsForTeam(match, 2)).to.equal(20);
        });

        it('should detect win and clean sheet and goal for team 1', function () {
            match.winner = 1;
            match.fullTimeScore1 = 1;
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(23);
        });

        it('should detect win and clean sheet and goal for team 2', function () {
            match.winner = 2;
            match.fullTimeScore2 = 1;
            expect(pointService.getMatchPointsForTeam(match, 2)).to.equal(23);
        });

        it('should detect loss for team 1', function () {
            match.winner = 2;
            match.fullTimeScore2 = 1;
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(0);
        });
    });

    describe('calculating match bonus points', function () {
        function getMatch(matchType, winner) {
            return {
                team1: {id: 1},
                team2: {id: 2},
                matchType: matchType,
                winner: winner
            };
        }

        it('group stage pass', function (done) {
            let match = getMatch("TOP_16_FINAL", 1);
            expect(pointService.getMatchBonusForTeam(match, 2)).to.equal(20);
            done();
        });

        it('Round of 16 win', function (done) {
            let match = getMatch("TOP_16_FINAL", 2);
            expect(pointService.getMatchBonusForTeam(match, 2)).to.equal(40);
            done();
        });
    });

    describe('overall', function () {
        var testData;
        var getMatchesAndTeamsStub, getTeamsStub;

        before(function (done) {

            fs.readFile("test/germany_matches.json", "UTF-8", function (err, data) {
                testData = JSON.parse(data);
                expect(testData.length).to.equal(7);
                done();
            });

        });

        beforeEach(function () {
            getMatchesAndTeamsStub = sinon.stub(fifa, 'getMatchesAndTeams', function () {
                return Promise.resolve(testData);
            });
            getTeamsStub = sinon.stub(fifa, 'getTeams', function() {
              return Promise.resolve( [{"id": 127, "title": "Germany", "code":"GER"}] );
            });
        });

        afterEach(function () {
            getMatchesAndTeamsStub.restore()
            getTeamsStub.restore();
        });

        it("should calculate Germany's points to be 294", function (done) {
            pointService.getPointsForTeam(127, 1.02)
                .then(function (points) {
                    expect(points).to.equal(294)
                    done()
                }).catch(function (err) {
                done(new Error(err));
            });
        });

        it('should combine team information and points', function(done) {
          pointService.getTeamAndPoints(127, 1.02).then(function(data) {
            console.log(data);
            expect(data.name).to.equal("Germany");
            expect(data.code).to.equal("GER");
            expect(data.points).to.equal(294);
            done();
          }).catch(function(err) {
            done(new Error(err));
          });
        })
    })
});
