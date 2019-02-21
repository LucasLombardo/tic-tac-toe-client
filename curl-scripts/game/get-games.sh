# TOKEN="" sh curl-scripts/game/get-games.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/games" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \


echo