'use strict';

const _ = require('lodash');
const MatchType = require('./matchType');
const countryCodes = require('./countrycodes');

const Points = {
    WIN: 15,
    DRAW: 7,
    LOSS: 0,
    GOAL: 3,
    CLEAN_SHEET: 5,
    TOP_16: 20,
    TOP_8: 20,
    TOP_4: 20,
    TOP_2: 25,
    CHAMPION: 35
};

// TODO: own service
function getCountryCode(code) {
  return _.lowerCase(countryCodes[code])
}

function getWinLoseDrawPoints(match, teamId) {
    if (match.winner == 0) return Points.DRAW;
    return match.winner == teamId ? Points.WIN : Points.LOSS;
};

function getMatchPointsForTeam(match, teamId) {
    let matchPoints =  getWinLoseDrawPoints(match, teamId);
    const isTeam1 = teamId == match.team1;
    // Clean Sheet
    if (match.score1 == 0 && !isTeam1) {
        matchPoints += Points.CLEAN_SHEET;
    }
    if (match.score2 == 0 && isTeam1) {
        matchPoints += Points.CLEAN_SHEET;
    }

    // Goals
    matchPoints += (isTeam1 ? match.score1 : match.score2) * Points.GOAL;
    return matchPoints;
};

function getMatchBonusForTeam(match, teamId) {
    switch (match.matchType) {
        case MatchType.TOP_16_FINAL:    return Points.TOP_16 + (teamId == match.winner? Points.TOP_8 : 0);
        case MatchType.QUARTER_FINAL:   return teamId == match.winner ? Points.TOP_4 : 0;
        case MatchType.SEMI_FINAL:      return teamId == match.winner ? Points.TOP_2 : 0;
        case MatchType.FINAL:           return teamId == match.winner ? Points.CHAMPION : 0;
        default:                        return 0;
    }
};

function getPointsForTeam(teamId, teamMatches, coefficient) {
    let points = 0;
    _.each(teamMatches,(match) => points += getMatchPointsForTeam(match, teamId));
    points = Math.round(points * (coefficient || 1));
    _.each(teamMatches, (match) => points += getMatchBonusForTeam(match, teamId));
    return points;
};

module.exports = {
    getPointsForTeam: getPointsForTeam,
    getMatchPointsForTeam: getMatchPointsForTeam,
    getMatchBonusForTeam: getMatchBonusForTeam
};
