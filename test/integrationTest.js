'use strict'

const fs = require('fs');
const expect = require("chai").expect;
const sinon = require('sinon');
const nock = require('nock');
const pointService = require('../services/pointService');
const footballDataService = require('../services/footballDataService');
let api;

describe('overall', function() {
  beforeEach(function() {
    api = nock('http://api.football-data.org/v1')
      .get('/soccerseasons/406/fixtures')
      .reply(200, fs.readFileSync("test/matches.json", "UTF-8"));
  });

  it("should calculate Germany's points to be 294", function(done) {
    footballDataService.getMatches()
      .then(function(matches) {
        let points = pointService.getPointsForTeam(759, matches, 1.02);
        expect(points).to.equal(294);
        done();
      }).catch(function(err) {
        done(new Error(err));
      });
  });
})
