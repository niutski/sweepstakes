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
  console.log("Point coefficient " + pointCoefficient);
  Promise.all([footballDataService.getMatches(), footballDataService.getTeam(teamId)])
    .then(function(data) {
      let teamMatches = _.filter(data[0], (match) => (match.team1 == teamId || match.team2 == teamId));
      let result ={
        id: parseInt(teamId, 10),
        points: pointService.getPointsForTeam(teamId, teamMatches, pointCoefficient),
        name: data[1].name,
        code: countrycodes[data[1].name],
        matches: teamMatches
      };
      console.log(result);
    res.send(result);
  }).catch(function(error) {
    console.log(error);
    res.send("ERROR")
  });
});

module.exports = router;
