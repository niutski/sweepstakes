module Model (..) where

import Http


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
  , scoreHome : Maybe Int
  , scoreAway : Maybe Int
  , pointBreakdown : MatchPointBreakdown
  }


type alias MatchPointBreakdown =
  { win : Maybe Int
  , draw : Maybe Int
  , cleanSheet : Maybe Int
  , goals : Maybe Int
  , bonus : Maybe Int
  }


toTeam : Maybe Team -> Team
toTeam maybe =
  Maybe.withDefault { name = "", id = 0, points = 0, code = "zz", matches = [] } maybe
