module Api (..) where

import Model exposing (..)
import Http exposing (Error)
import Task exposing (Task)
import Json.Decode as Json exposing (..)
import Json.Decode.Extra exposing (..)


getParticipants : List Participant
getParticipants =
  [ { name = "Lisa", teamId = 759, teamRank = 1, team = Nothing }
  , { name = "Howard", teamId = 760, teamRank = 2, team = Nothing }
  , { name = "Oliver", teamId = 805, teamRank = 5, team = Nothing }
  , { name = "Martyn", teamId = 808, teamRank = 9, team = Nothing }
  , { name = "Totman", teamId = 784, teamRank = 6, team = Nothing }
  , { name = "Alex", teamId = 773, teamRank = 8, team = Nothing }
  , { name = "Janne", teamId = 790, teamRank = 14, team = Nothing }
  , { name = "Mika", teamId = 792, teamRank = 16, team = Nothing }
  , { name = "Eero", teamId = 794, teamRank = 17, team = Nothing }
  , { name = "Andy", teamId = 811, teamRank = 18, team = Nothing }
  , { name = "Ali", teamId = 788, teamRank = 10, team = Nothing }
  ]


getTeam : Int -> Int -> Task Http.Error Team
getTeam id ranking =
  Http.get
    teamDecoder
    ("/teams/" ++ (toString id) ++ "?ranking=" ++ (toString ranking))


teamDecoder : Json.Decoder (Team)
teamDecoder =
  object5
    Team
    ("id" := int)
    ("name" := string)
    ("points" := int)
    ("code" := string)
    ("matches" := matchListDecoder)


matchListDecoder : Json.Decoder (List Match)
matchListDecoder =
  list matchDecoder


matchDecoder : Json.Decoder Match
matchDecoder =
  object4
    Match
    ("team1name" := string)
    ("team2name" := string)
    ("date" := date)
    ("pointBreakdown" := pointBreakdownDecoder)


pointBreakdownDecoder : Json.Decoder MatchPointBreakdown
pointBreakdownDecoder =
  object5
    MatchPointBreakdown
    ("win" := maybe int)
    ("draw" := maybe int)
    ("cleanSheet" := maybe int)
    ("goals" := maybe int)
    ("bonus" := maybe int)
