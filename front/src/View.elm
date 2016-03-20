module View (..) where

import Html exposing (..)
import Model exposing (..)
import Signal exposing (Address)


view : Address Action -> Model -> Html
view address model =
  div [] [ participantToHtml model ]


participantToHtml : Participant -> Html
participantToHtml participant =
  div
    []
    [ span [] [ text (.name participant) ]
    , div [] [ (teamToHtml (.team participant)) ]
    ]


teamToHtml : Maybe Team -> Html
teamToHtml team =
  div
    []
    [ span [] [ text (team |> toTeam |> .name) ]
    , span [] [ text (team |> toTeam |> .points |> toString) ]
    ]


toTeam : Maybe Team -> Team
toTeam maybe =
  Maybe.withDefault { name = "", id = 0, points = 0 } maybe
