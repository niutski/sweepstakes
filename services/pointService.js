'use strict';

const _ = require('lodash');
const MatchType = require('./matchType');
const countryCodes = require('./countrycodes');
const Points = require('./points');

function getCleanSheetPoints(match, teamId) {
  if (teamId == match.team1) {
    return match.score2 == 0 ? Points.CLEAN_SHEET : 0;
  }
  return match.score1 == 0 ? Points.CLEAN_SHEET : 0;
}

function getMatchBonusForTeam(match, teamId) {
  switch (match.matchType) {
    case MatchType.TOP_16_FINAL:
      return Points.TOP_16 + (teamId == match.winner ? Points.TOP_8 : 0);
    case MatchType.QUARTER_FINAL:
      return teamId == match.winner ? Points.TOP_4 : 0;
    case MatchType.SEMI_FINAL:
      return teamId == match.winner ? Points.TOP_2 : 0;
    case MatchType.FINAL:
      return teamId == match.winner ? Points.CHAMPION : 0;
    default:
      return 0;
  }
};

function getPointsForTeam(teamId, matches, coefficient) {
  return Math.round(
          _(matches)
            .filter((match) => match.team1 == teamId || match.team2 == teamId)
            .filter((match) => match.status != "TIMED")
            .map(_.curry(getPointBreakdownForTeam)(teamId))
            .reduce(function(total, pb) {
                return total +
                  (pb.winOrDraw + pb.goals + pb.cleanSheet) * coefficient +
                  pb.bonus;
              }, 0));
};

function getMatchResultPoints(teamId, match) {
  if (match.score1 == match.score2) return Points.DRAW;
  if (match.score1 > match.score2) return teamId == match.team1 ? Points.WIN : 0;
  return teamId == match.team1 ? 0 : Points.WIN;
};

function getPointBreakdownForTeam(teamId, match) {
  if (match.status == "TIMED") return {winOrDraw:null, goals:null, cleanSheet:null, bonus:null};
  return {
    winOrDraw: getMatchResultPoints(teamId, match),
    goals: (teamId == match.team1 ? match.score1 : match.score2) * Points.GOAL,
    cleanSheet: getCleanSheetPoints(match, teamId),
    bonus: getMatchBonusForTeam(match, teamId)
  }
}

module.exports = {
  getPointsForTeam: getPointsForTeam,
  getPointBreakdownForTeam: getPointBreakdownForTeam
};
