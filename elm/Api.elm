module Api (..) where

import Model exposing (..)
import Http exposing (Error)
import Task exposing (Task)
import Json.Decode as Json exposing (..)


getParticipants : List Participant
getParticipants =
  [ { name = "Howie", teamId = 138, teamRank = 4, team = Nothing }
  , { name = "Alex", teamId = 214, teamRank = 7, team = Nothing }
  , { name = "Ali", teamId = 153, teamRank = 6, team = Nothing }
  , { name = "Martyn", teamId = 129, teamRank = 1, team = Nothing }
  , { name = "Janne", teamId = 210, teamRank = 5, team = Nothing }
  , { name = "Mika", teamId = 134, teamRank = 9, team = Nothing }
  , { name = "Ollie", teamId = 127, teamRank = 2, team = Nothing }
  , { name = "Dan", teamId = 211, teamRank = 3, team = Nothing }
  , { name = "Andy", teamId = 215, teamRank = 8, team = Nothing }
  ]


getTeam : Int -> Int -> Task Http.Error Team
getTeam id ranking =
  Http.get
    teamDecoder
    ("http://localhost:3000/fifa/teams/" ++ (toString id) ++ "?ranking=" ++ (toString ranking))



-- ("/fifa/teams/" ++ (toString id))


teamDecoder : Json.Decoder (Team)
teamDecoder =
  object3
    Team
    ("id" := int)
    ("name" := string)
    ("points" := int)
