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


update : Action -> Model -> ( Model, Effects Action )
update action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    FetchedTeam taskResult ->
      case taskResult of
        Ok team ->
          ( { model | team = Just team }, Effects.none )

        Err error ->
          Debug.log
            (toString error)
            ( model, Effects.none )


getTeams : Int -> Effects Action
getTeams id =
  Api.getTeam id
    |> Task.toResult
    |> Task.map FetchedTeam
    |> Effects.task


app : App Model
app =
  start { init = init, view = view, update = update, inputs = [] }


init : ( Model, Effects Action )
init =
  Debug.log
    "foo"
    ( Api.getParticipants
    , (getTeams (.teamId Api.getParticipants))
    )


main : Signal Html.Html
main =
  app.html


port tasks : Signal (Task.Task Never ())
port tasks =
  app.tasks