module View (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Model exposing (..)
import Signal exposing (Address)


view : Address Action -> Model -> Html
view address model =
  div [ class "pure-g" ] (List.map participantToHtml model)


participantToHtml : Participant -> Html
participantToHtml participant =
  div
    [ class "pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" ]
    [ div
        [ class "participant-card" ]
        [ div [ class "card-title" ] [ text (.name participant) ]
        , span [ class "team-name" ] [ text (participant |> .team |> toTeam |> .name) ]
        , span [ class "team-points" ] [ text (participant |> .team |> toTeam |> .points |> toString) ]
        ]
    ]
