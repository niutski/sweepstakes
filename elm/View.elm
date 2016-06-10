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
    [ class "pure-u-1 pure-u-md-1 pure-u-lg-1-2" ]
    [ div
        [ class "participant-card" ]
        [ div
            [ class "participant-name" ]
            [ text (.name participant)
            , span [ class "team-points" ] [ text (participant |> .team |> toTeam |> .points |> toString) ]
            , flagDiv participant
            ]
        , span [ class "team-name" ] [ text (participant |> .team |> toTeam |> .name) ]
        , rankingInfo participant
        , div
            [ class "team-point-table" ]
            [ (matchTable (participant |> .team |> toTeam |> .matches)) ]
        ]
    ]


rankingInfo : Participant -> Html
rankingInfo participant =
  span [ class "team-rank" ] [ text ("(ranked " ++ (participant |> .teamRank |> toString) ++ ")") ]


flagDiv : Participant -> Html
flagDiv participant =
  div [ class ("flag flag-icon-background flag-icon-" ++ (participant |> .team |> toTeam |> .code)) ] []


matchTable : List Match -> Html
matchTable matches =
  table
    [ class "pure-table" ]
    [ headerRow
    , tbody [] (List.map matchRow matches)
    ]


headerRow : Html
headerRow =
  thead
    []
    [ tr
        []
        [ th [] [ text "Home" ]
        , th [] [ text "Away" ]
        , th [] [ text "Win" ]
        , th [] [ text "Draw" ]
        , th [] [ text "Goals" ]
        , th [] [ text "Clean sheet" ]
        , th [] [ text "Bonus" ]
        ]
    ]


matchRow : Match -> Html
matchRow match =
  tr
    []
    [ td [] [ text (match |> .homeTeam) ]
    , td [] [ text (match |> .awayTeam) ]
    , td [] [ text (match |> .pointBreakdown |> .win |> maybeIntToString) ]
    , td [] [ text (match |> .pointBreakdown |> .draw |> maybeIntToString) ]
    , td [] [ text (match |> .pointBreakdown |> .goals |> maybeIntToString) ]
    , td [] [ text (match |> .pointBreakdown |> .cleanSheet |> maybeIntToString) ]
    , td [] [ text (match |> .pointBreakdown |> .bonus |> maybeIntToString) ]
    ]


maybeIntToString : Maybe Int -> String
maybeIntToString m =
  case m of
    Just x ->
      toString x

    Nothing ->
      ""
