module Api (..) where

import Model exposing (..)
import Http exposing (Error)
import Task exposing (Task)
import Json.Decode as Json exposing (..)


getParticipants : List Participant
getParticipants =
  [ { name = "Howie", teamId = 765, teamRank = 4, team = Nothing }
  , { name = "Alex", teamId = 758, teamRank = 7, team = Nothing }
  , { name = "Ali", teamId = 788, teamRank = 6, team = Nothing }
  , { name = "Martyn", teamId = 760, teamRank = 1, team = Nothing }
  , { name = "Janne", teamId = 762, teamRank = 5, team = Nothing }
  , { name = "Mika", teamId = 784, teamRank = 9, team = Nothing }
  , { name = "Ollie", teamId = 759, teamRank = 2, team = Nothing }
  , { name = "Dan", teamId = 764, teamRank = 3, team = Nothing }
  , { name = "Andy", teamId = 818, teamRank = 8, team = Nothing }
  ]


getTeam : Int -> Int -> Task Http.Error Team
getTeam id ranking =
  Http.get
    teamDecoder
    ("/teams/" ++ (toString id) ++ "?ranking=" ++ (toString ranking))


teamDecoder : Json.Decoder (Team)
teamDecoder =
  object4
    Team
    ("id" := int)
    ("name" := string)
    ("points" := int)
    ("code" := string)
