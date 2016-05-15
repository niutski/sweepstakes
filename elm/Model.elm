module Model (..) where

import Http
import Date


type Action
  = NoOp
  | FetchedTeam (Result Http.Error Team)


type alias Model =
  List Participant


type alias Participant =
  { name : String
  , teamId : Int
  , team : Maybe Team
  , teamRank : Int
  }


type alias Team =
  { id : Int
  , name : String
  , points : Int
  , code : String
  , matches : List Match
  }


type alias Match =
  { homeTeam : String
  , awayTeam : String
  , date : Date.Date
  }


toTeam : Maybe Team -> Team
toTeam maybe =
  Maybe.withDefault { name = "", id = 0, points = 0, code = "zz", matches = [] } maybe
