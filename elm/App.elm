module App (..) where

import View exposing (view)
import Model exposing (..)
import StartApp exposing (..)
import Api
import Html
import Effects
import Task
import Signal exposing (Signal, Mailbox, Address, send)
import Effects exposing (Effects, Never)
import List exposing (..)


getPoints : Participant -> Int
getPoints participant =
  participant
    |> .team
    |> toTeam
    |> .points


update : Action -> Model -> ( Model, Effects Action )
update action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    FetchedTeam taskResult ->
      case taskResult of
        Ok team ->
          let
            updateTeam participant =
              if (.id team) == (.teamId participant) then
                { participant | team = Just team }
              else
                participant
          in
            ( model |> map updateTeam |> sortBy getPoints |> reverse, Effects.none )

        Err error ->
          Debug.log
            (toString error)
            ( model, Effects.none )


getTeam : Participant -> Effects Action
getTeam participant =
  Api.getTeam (.teamId participant) (.teamRank participant)
    |> Task.toResult
    |> Task.map FetchedTeam
    |> Effects.task


fetchTeams : Effects Action
fetchTeams =
  Effects.batch
    (List.map
      getTeam
      Api.getParticipants
    )


app : App Model
app =
  start { init = init, view = view, update = update, inputs = [] }


init : ( Model, Effects Action )
init =
  ( Api.getParticipants
  , fetchTeams
  )


main : Signal Html.Html
main =
  app.html


port tasks : Signal (Task.Task Never ())
port tasks =
  app.tasks
