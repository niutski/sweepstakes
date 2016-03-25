var express = require('express');
var router = express.Router();
var fifa = require('../services/fifa');
var pointService = require('../services/pointService');

router.get('/teams', function(req, res, next) {
  fifa.getTeams().then(function(data) {
    res.send(data);
  });
});

router.get('/matches', function(req, res, next) {
  fifa.getMatches().then(function(data) {
    res.send(data);
  });
});

router.get('/teams/:teamId/points', function(req,res,next) {
  pointService.getPointsForTeam(req.params.teamId, 1)
    .then(function(points) {
      res.send({"points": points});
    });
});

router.get('/teams/:teamId', function (req, res, next) {
  pointService.getTeamAndPoints(req.params.teamId, 1)
  .then(function(data) {
    res.send(data);
  }).catch(function(error) {
    logErrors(error, req, res, next);
    res.send("ERROR")
  });
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

router.use(logErrors);

module.exports = router;
