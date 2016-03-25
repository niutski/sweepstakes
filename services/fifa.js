'use strict';

var _ = require('lodash');
var MatchType = require('./matchType')
var request = require('request')
  .defaults({
    baseUrl: 'https://montanaflynn-fifa-world-cup.p.mashape.com/',
    headers: {
      'X-Mashape-Key': process.env.mashapeApiKey,
      'accepts': 'json',
      'Accept': 'application/json'
    }
  });

var FifaService = {
  getCacheTimestampPropertyName: function(url) {
    return url + "_cacheTimestamp";
  },

  getMinimumCacheTimestamp: function(url) {
    var maxAgeMinutes = process.env.cacheMaxAgeMinutes || "5";
    return new Date().getTime() - (parseInt(maxAgeMinutes, 10) * 60000)
  },

  request: function(url) {
    var _this = this;
    return new Promise(function(fulfill, reject) {
      if (_this[url] && (_this[_this.getCacheTimestampPropertyName(url)] > _this.getMinimumCacheTimestamp(url))) {
        console.log("Return " + url + " from cache");
        fulfill(_this[url]);
      } else {
        request(url, function(error, response, body) {
          console.log("Fetch " + url + " from backend");
          var data = JSON.parse(body);
          _this[url] = data;
          _this[_this.getCacheTimestampPropertyName(url)] = new Date().getTime();
          fulfill(_this[url]);
        });
      }
    });
  },

  getTeams: function() {
    return this.request('teams');
  },

  getMatches: function() {
    return this.request('games');
  },

  getMatchesAndTeams: function() {
    return Promise.all([this.getMatches()]).then(this.processMatches);
  },



  processMatches: function(values) {
    let matches = values[0];
    let data = _.map(matches, function(match) {
      return {
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        fullTimeScore1: match.score1,
        fullTimeScore2: match.score2,
        extraTimeScore1: match.score1et,
        extraTimeScore2: match.score2et,
        penaltyScore1: match.score1p,
        penaltyScore2: match.score2p,
        winner: FifaService.getMatchWinnerId(match),
        matchType: FifaService.getMatchType(match)
      };
    });
    return Promise.resolve(data);
  },

  getMatchWinnerId: function(match) {
    if (match.winner == 0) return 0;
    return match.winner == 1 ? match.team1_id : match.team2_id;
  },

  getMatchType: function(match) {
    if (match.knockout === "f") return MatchType.GROUP;
    if (match.id == 64) return MatchType.FINAL;
    if (match.id == 63) return MatchType.BRONZE_FINAL;
    if (match.id == 61 || match.id == 62) return MatchType.SEMI_FINAL;
    if (match.id > 56 && match.id <= 60) return MatchType.QUARTER_FINAL;
    if (match.id >= 49) return MatchType.TOP_16_FINAL;
    return MatchType.UNKNOWN;
  }
}

module.exports = FifaService
