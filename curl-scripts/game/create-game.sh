# TOKEN="BAhJIiUwODdjOTkyZmQ2YTFkNGRlY2QxOTdjM2I4OGRiZmMzYwY6BkVG--1ebf25146c97caab7218f0e202bdd6b41b7f927d" sh curl-scripts/game/create-game.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/games" \
  --include \
  --request POST \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \


echo