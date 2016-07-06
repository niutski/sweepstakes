'use strict';

const expect = require("chai").expect;
const pointService = require('../services/pointService');

describe('Point service', function() {
  var match;

  beforeEach(function() {
    match = {
      team1: 1,
      team2: 2,
      score1: 0,
      score2: 0,
      winner: 0,
      matchType: "GROUP"
    }
  });

  it('should detect draw and clean sheet for team 1', function() {
    let breakdown = pointService.getPointBreakdownForTeam(1, match)
    expect(breakdown.winOrDraw).to.equal(7);
    expect(breakdown.goals).to.equal(0);
    expect(breakdown.cleanSheet).to.equal(5);
    expect(breakdown.bonus).to.equal(0);
  });

  it('should detect win for team2 and goals', function() {
    match.score1 = 1;
    match.winner = 2;
    match.score2 = 2;

    let breakdown = pointService.getPointBreakdownForTeam(2, match)

    expect(breakdown.winOrDraw).to.equal(15);
    expect(breakdown.goals).to.equal(6);
    expect(breakdown.cleanSheet).to.equal(0);
    expect(breakdown.bonus).to.equal(0);
  });

  it('should detect loss', function() {
    match.score1 = 1;
    match.winner = 1;

    let breakdown = pointService.getPointBreakdownForTeam(2, match);

    expect(breakdown.winOrDraw).to.equal(0);
    expect(breakdown.goals).to.equal(0);
    expect(breakdown.cleanSheet).to.equal(0);
    expect(breakdown.bonus).to.equal(0);
  });

  it('should detect group stage pass and round of 16 win', function() {
    match.matchType = "TOP_16_FINAL";
    match.winner = 2;

    expect(pointService.getPointBreakdownForTeam(1, match).bonus).to.equal(20);
    expect(pointService.getPointBreakdownForTeam(2, match).bonus).to.equal(40);
  });

  it('should detect playoff stage penalty shootout win', function() {
    match.matchType = "QUARTER_FINAL";
    match.score1 = 1;
    match.score2 = 1;
    match.winner = 1;
    let breakdown = pointService.getPointBreakdownForTeam(1, match);
    expect(breakdown.winOrDraw).to.equal(7);
    expect(breakdown.bonus).to.equal(20);
  })
});
