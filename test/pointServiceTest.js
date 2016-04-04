'use strict';

const expect = require("chai").expect;
const pointService = require('../services/pointService');

describe('Point service', function () {
    describe('calculating match points', function () {
        var match;

        beforeEach(function () {
            match = {
                team1: 1,
                team2: 2,
                score1: 0,
                score2: 0,
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
            match.score1 = 1;
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(23);
        });

        it('should detect win and clean sheet and goal for team 2', function () {
            match.winner = 2;
            match.score2 = 1;
            expect(pointService.getMatchPointsForTeam(match, 2)).to.equal(23);
        });

        it('should detect loss for team 1', function () {
            match.winner = 2;
            match.score2 = 1;
            expect(pointService.getMatchPointsForTeam(match, 1)).to.equal(0);
        });
    });

    describe('calculating match bonus points', function () {
        function getMatch(matchType, winner) {
            return {
                team1: 1,
                team2: 2,
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

});
