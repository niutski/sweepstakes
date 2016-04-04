'use strict';

const _ = require('lodash');
const MatchType = require('./matchType')
const httpGet = require('request')
  .defaults({
    baseUrl: 'http://api.football-data.org/v1/',
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY,
      'accepts': 'json',
      'Accept': 'application/json'
    }
  });

const cache = {};

function getCacheName(url) {
  return _.takeRight(_.split(url, "/"));
}

function getMinimumCacheTimestamp() {
  let maxAgeMinutes = process.env.cacheMaxAgeMinutes || "5";
  return new Date().getTime() - (parseInt(maxAgeMinutes, 10) * 60000)
}

function request(url) {
  let cacheEntryName = getCacheName(url);
  return new Promise(function(fulfill, reject) {
    if (cache[cacheEntryName] && (cache[cacheEntryName+"_timestamp"] > getMinimumCacheTimestamp())) {
      console.log("Return " + url + " from cache");
      fulfill(cache[cacheEntryName]);
    } else {
      httpGet(url, function(error, response, body) {
        console.log("Fetch " + url + " from backend");
        let data = JSON.parse(body);
        cache[cacheEntryName] = data;
        cache[cacheEntryName+"_timestamp"] = new Date().getTime();
        fulfill(cache[cacheEntryName]);
      });
    }
  });
}

function processMatches(data) {
  return _.map(data.fixtures, function(match) {
    return {
      team1: getTeamId(match._links.homeTeam.href),
      team2: getTeamId(match._links.awayTeam.href),
      team1name: match.homeTeamName,
      team2name: match.awayTeamName,
      score1: match.result.extraTime ? match.result.extraTime.goalsHomeTeam : match.result.goalsHomeTeam,
      score2: match.result.extraTime ? match.result.extraTime.goalsAwayTeam : match.result.goalsAwayTeam,
      winner: getMatchWinnerId(match),
      matchType: getMatchType(match)
    };
  });
}

function getTeamId(href) {
  return parseInt(_.takeRight(_.split(href, "/")), 10);
}

function getMatchWinnerId(match) {
  let score = match.result.penaltyShootout || match.result.extraTime || match.result;
  if (score.goalsHomeTeam === score.goalsAwayTeam) return 0;

  return (score.goalsHomeTeam > score.goalsAwayTeam)
    ? getTeamId(match._links.homeTeam.href)
    : getTeamId(match._links.awayTeam.href);
}

function getMatchType(match) {
  if (match.matchday < 4) return MatchType.GROUP;
  if (match.matchday == 7) return MatchType.FINAL;
  if (match.matchday == 8) return MatchType.BRONZE_FINAL;
  if (match.matchday == 6) return MatchType.SEMI_FINAL;
  if (match.matchday == 5) return MatchType.QUARTER_FINAL;
  if (match.matchday == 4) return MatchType.TOP_16_FINAL;
  return MatchType.UNKNOWN;
}

function findTeam(teamId) {
  return function(teamData) {
    let team = _.find(teamData.teams, (t) => getTeamId(t._links.self.href) == teamId);
    return {
      teamId: teamId,
      name: team.name
    }
  }
}

module.exports = {
  getTeam: function(teamId) {
    return request('soccerseasons/406/teams').then(findTeam(teamId));
  },

  getMatches: function() {
    return request('soccerseasons/406/fixtures').then(processMatches);
  },

  getMatchType: getMatchType
};
