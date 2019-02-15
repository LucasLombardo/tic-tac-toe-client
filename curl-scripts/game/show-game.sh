# ID="387" TOKEN="BAhJIiUwODdjOTkyZmQ2YTFkNGRlY2QxOTdjM2I4OGRiZmMzYwY6BkVG--1ebf25146c97caab7218f0e202bdd6b41b7f927d" sh curl-scripts/game/show-game.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/games/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \


echo