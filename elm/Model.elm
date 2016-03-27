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
  }
