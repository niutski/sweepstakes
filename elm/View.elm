module View (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Model exposing (..)
import Signal exposing (Address)


view : Address Action -> Model -> Html
view address model =
  div [] (List.map participantToHtml model)


participantToHtml : Participant -> Html
participantToHtml participant =
  div
    []
    [ span [ class "participant" ] [ text (.name participant) ]
    , div [ class "team" ] [ (teamToHtml (.team participant)) ]
    ]


teamToHtml : Maybe Team -> Html
teamToHtml team =
  div
    []
    [ span [ class "team-name" ] [ text (team |> toTeam |> .name) ]
    , span [] [ text " " ]
    , span [ class "teamp-points" ] [ text (team |> toTeam |> .points |> toString) ]
    ]


toTeam : Maybe Team -> Team
toTeam maybe =
  Maybe.withDefault { name = "", id = 0, points = 0 } maybe
