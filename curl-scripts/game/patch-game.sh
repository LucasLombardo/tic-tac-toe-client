# ID="" TOKEN="" sh curl-scripts/game/patch-game.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/games/${ID}" \
  --include \
  --request PATCH \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
        "game": {
            "cell": {
            "index": 2,
            "value": "o"
            },
            "over": false
        }
    }'


echo