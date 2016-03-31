'use strict';

const _ = require('lodash');
const statProvider = require('./fifa');
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

function getCountryCode(code) {
  return _.lowerCase(countryCodes[code])
}

const PointService = {
    getTeamAndPoints: function (teamId, coefficient) {
      return Promise.all([statProvider.getTeams(), this.getPointsForTeam(teamId, coefficient)])
        .then(function(args) {
          let team = _.find(args[0], function(team) {return team.id == teamId; });
          let retVal = {id : team.id, points : args[1], name: team.title, code:getCountryCode(team.code)};
          return Promise.resolve(retVal);
        });
    },

    getPointsForTeam: function (teamId, coefficient) {
        let _this = this;
        return statProvider.getMatchesAndTeams()
            .then(function (matches) {
                let teamMatches = _.filter(matches, (match) => (match.team1_id == teamId || match.team2_id == teamId));
                let points = 0;
                _.each(teamMatches,(match) => points += _this.getMatchPointsForTeam(match, teamId));
                points = Math.round(points * (coefficient || 1));
                _.each(teamMatches, (match) => points += _this.getMatchBonusForTeam(match, teamId));
                return Promise.resolve(points);
            });
    },

    getWinLoseDrawPoints: function (match, teamId) {
        if (match.winner == 0) return Points.DRAW;
        return match.winner == teamId ? Points.WIN : Points.LOSS;
    },

    getMatchPointsForTeam: function (match, teamId) {
        let matchPoints =  this.getWinLoseDrawPoints(match, teamId);

        const score1 = match.fullTimeScore1 + match.extraTimeScore1;
        const score2 = match.fullTimeScore2 + match.extraTimeScore2;
        const isTeam1 = teamId == match.team1_id;
        // Clean Sheet
        if (score1 == 0 && !isTeam1) {
            matchPoints += Points.CLEAN_SHEET;
        }
        if (score2 == 0 && isTeam1) {
            matchPoints += Points.CLEAN_SHEET;
        }

        // Goals
        matchPoints += (isTeam1 ? score1 : score2) * Points.GOAL;

        return matchPoints;
    },

    getMatchBonusForTeam: function (match, teamId) {
        let bonus = 0;
        switch (match.matchType) {
            case MatchType.TOP_16_FINAL:    bonus = Points.TOP_16 + (teamId == match.winner? Points.TOP_8 : 0);break;
            case MatchType.QUARTER_FINAL:   bonus = (teamId == match.winner? Points.TOP_4 : 0);; break;
            case MatchType.SEMI_FINAL:      bonus = (teamId == match.winner? Points.TOP_2 : 0); break;
            case MatchType.FINAL:           bonus = (teamId == match.winner? Points.CHAMPION : 0); break;
            default:                bonus = 0;
        }
        return bonus;
    }
};

module.exports = PointService;
