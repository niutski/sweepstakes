'use strict';

var assert = require("chai").assert;
var nock = require("nock");
var fifa = require('../services/fifa');
var MatchType = require('../services/matchType');
var fifaApi;

describe('FifaService', function() {
  beforeEach(function() {
    process.env.cacheMaxAgeMinutes = -1; // Always fetch from mocked backend
    fifaApi = nock('https://montanaflynn-fifa-world-cup.p.mashape.com')
      .get('/teams')
      .reply(200, '[{"id":1,"title":"Algeria"},{"id":2, "title": "Egypt"}]');
  })

  it('should fetch teams from the teams backend endpoint', function(done) {
    fifa.getTeams()
      .then(function(data) {
        console.log(data)
        assert.equal(data.length, 2);
        assert.equal(fifaApi.isDone(), true);
        done();
      }).catch(function(err) {
        done(new Error(err));
      });
  });

  it('should cache results for 5 minutes when environment variable is not defined', function(done) {
    fifa.getTeams()
    .then(function(data) {
      delete process.env.cacheMaxAgeMinutes;
      assert.equal(data.length, 2);
      return fifa.getTeams();
    }).then(function(data) {
      assert.equal(data.length, 2);
      assert.equal(fifaApi.isDone(), true);
      done();
    }).catch(function(err) {
      done(new Error(err));
    });
  });

  it('should determine the match type correctly', function() {
    assert.equal(fifa.getMatchType({knockout:"f"}), MatchType.GROUP);
    assert.equal(fifa.getMatchType({knockout:"t", id:64}), MatchType.FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:63}), MatchType.BRONZE_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:62}), MatchType.SEMI_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:61}), MatchType.SEMI_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:60}), MatchType.QUARTER_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:59}), MatchType.QUARTER_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:58}), MatchType.QUARTER_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:57}), MatchType.QUARTER_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:56}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:55}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:54}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:53}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:52}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:51}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:50}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:49}), MatchType.TOP_16_FINAL);
    assert.equal(fifa.getMatchType({knockout:"t", id:48}), MatchType.UNKNOWN);
  });
});
