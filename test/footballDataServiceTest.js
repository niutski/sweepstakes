'use strict';

const assert = require("chai").assert;
const nock = require("nock");
const footballDataService = require('../services/footballDataService');
const MatchType = require('../services/matchType');
var api;

describe('Football-data', function() {
  beforeEach(function() {
    let teams =
    {teams:[
        {_links: {self: {href: "http://api.football-data.org/v1/teams/764"}}, name: "Brazil"},
        {_links: {self: {href: "http://api.football-data.org/v1/teams/765"}}, name: "Croatia"}
      ]};
    api = nock('http://api.football-data.org/v1')
      .get('/soccerseasons/406/teams')
      .reply(200, JSON.stringify(teams));
  });

  afterEach(function() {
    nock.cleanAll();
  })

  it('should fetch teams from the API', function(done) {
    footballDataService.getTeam(764)
      .then(function(data) {
        assert.equal(data.name, "Brazil");
        done();
      }).catch(function(err) {
        done(new Error(err));
      });
  });

  it('should determine the match type correctly', function() {
    assert.equal(footballDataService.getMatchType({matchday:3}), MatchType.GROUP);
    assert.equal(footballDataService.getMatchType({matchday:8}), MatchType.BRONZE_FINAL);
    assert.equal(footballDataService.getMatchType({matchday:7}), MatchType.FINAL);
    assert.equal(footballDataService.getMatchType({matchday:6}), MatchType.SEMI_FINAL);
    assert.equal(footballDataService.getMatchType({matchday:5}), MatchType.QUARTER_FINAL);
    assert.equal(footballDataService.getMatchType({matchday:4}), MatchType.TOP_16_FINAL);
    assert.equal(footballDataService.getMatchType({matchday:48}), MatchType.UNKNOWN);
  });
});
