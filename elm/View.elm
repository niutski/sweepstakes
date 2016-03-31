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
        [ div
            [ class "participant-name" ]
            [ text (.name participant)
            , flagDiv participant
            ]
        , span [ class "team-name" ] [ text (participant |> .team |> toTeam |> .name) ]
        , span [ class "team-points" ] [ text (participant |> .team |> toTeam |> .points |> toString) ]
        , div
            [ class "team-point-table" ]
            [ (teamPointTable (participant |> .team |> toTeam)) ]
        ]
    ]


flagDiv : Participant -> Html
flagDiv participant =
  div [ class ("flag flag-icon-background flag-icon-" ++ (participant |> .team |> toTeam |> .code)) ] []


teamPointTable : Team -> Html
teamPointTable team =
  table
    [ class "pure-table" ]
    [ headerRow
    , matchRow
    ]


headerRow : Html
headerRow =
  thead
    []
    [ tr
        []
        [ th [] [ text "Opponent" ]
        ]
    ]


matchRow : Html
matchRow =
  tr [] [ td [] [ text "X" ] ]
