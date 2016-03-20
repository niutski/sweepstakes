module Api (..) where

import Model exposing (..)
import Http exposing (Error)
import Task exposing (Task)
import Json.Decode as Json exposing (..)


getParticipants : Participant
getParticipants =
  { name = "Ollie", teamId = 127, team = Nothing }



-- , { name = "Janne", teamId = 210, team = Nothing }
-- ]


getTeam : Int -> Task Http.Error Team
getTeam id =
  Http.get
    teamDecoder
    ("/fifa/teams/" ++ (toString id))


teamDecoder : Json.Decoder (Team)
teamDecoder =
  object3
    Team
    ("id" := int)
    ("name" := string)
    ("points" := int)
