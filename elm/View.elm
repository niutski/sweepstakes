module View (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Model exposing (..)
import Signal exposing (Address)


view : Address Action -> Model -> Html
view address model =
  div [ class "container-fluid" ] (List.map participantToHtml model)


participantToHtml : Participant -> Html
participantToHtml participant =
  div
    [ class "col-md-4" ]
    [ div
        [ class "card card-info p-a-1 text-xs-center" ]
        [ h4 [ class "card-title" ] [ text (.name participant) ]
        , div [ class "card-text" ] [ (teamToHtml (.team participant)) ]
        ]
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
