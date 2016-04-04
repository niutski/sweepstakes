Acknowledgements
----------------
The data is provided by http://api.football-data.org/index


Description
-----------

This project allows the user to play sweepstakes with friends. The basic principle is as follows:
- A group of N friends sign up.
- Each friend is assigned a team at random from the highest-ranked N teams in the tournament
- Each team is given a coefficient R based on its ranking. The coefficient is 1.x, where x is the zero-padded ranking of the team to 2 decimal places. That means that the team that is ranked first has a coefficient of 1.01, and the team that is ranked 20th has a coefficient of 1.20.

Scoring
-------
For each played match (at the end of the 90 minutes), each team gets adjusted points as follows:
- Wins (15 * R)
- Draw (7 * R)
- Loss (0 * R)
- Goal scored (3 * R for each goal)
- Clean sheet (5 * R)

This means that in the playoff stages, if the game is tied and overtime is played, both teams get 7 points for that match.

On top of that, unadjusted points are given for the following achievements:
- Qualification to playoff stage (20)
- Top 16 (20)
- Top 8 (20)
- Top 4 (20)
- Top 2 (25)
- World Champion (35)

Running
-------

1. Run `npm install && gulp elm`
1. Set your `X-Auth-Token` that you have from signing up to http://api.football-data.org/index in the `.env` file
1. Run `npm start`

Development
-----------
1. To develop the Elm frontend, run the node server with the `run-dev.sh` script
1. Run `elm-live elm/App.elm`
1. Any changes you make to your Elm code will be live-reloaded by elm-live
