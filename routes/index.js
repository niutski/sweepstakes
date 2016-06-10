'use strict'

const express = require('express');
const router = express.Router();
const _ = require('lodash');

const footballDataService = require('../services/footballDataService');
const pointService = require('../services/pointService');
const countrycodes = require("../services/countrycodes");

router.get('/teams/:teamId', function (req, res, next) {
  let teamId = req.params.teamId;
  let pointCoefficient = 1 + (req.query.ranking / 100);
  Promise.all([footballDataService.getMatches(), footballDataService.getTeam(teamId)])
    .then(function(data) {
      let teamMatches = getTeamMatches(data[0], teamId);
      let result ={
        id: parseInt(teamId, 10),
        points: pointService.getPointsForTeam(teamId, teamMatches, pointCoefficient),
        name: data[1].name,
        code: countrycodes[data[1].name],
        matches: _.map(teamMatches, addPointBreakdownForTeam(teamId))
      };
    res.send(result);
  }).catch(function(error) {
    console.log(error);
    res.send({"error": error});
  });
});

function isTeamMatch(teamId) {
  return function(match) {
    return match.team1 == teamId || match.team2 == teamId
  }
}

function addPointBreakdownForTeam(teamId) {
  return function(match) {
    match.pointBreakdown = pointService.getPointBreakdownForTeam(teamId, match);
    return match;
  }
};

function getTeamMatches(allMatches, teamId) {
  return _.filter(allMatches, isTeamMatch(teamId));
};

module.exports = router;
