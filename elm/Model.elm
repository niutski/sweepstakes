module Model (..) where

import Http


type Action
  = NoOp
  | FetchedTeam (Result Http.Error Team)


type alias Model =
  Participant


type alias Participant =
  { name : String
  , teamId : Int
  , team : Maybe Team
  }


type alias Team =
  { id : Int
  , name : String
  , points : Int
  }
