# TOKEN="BAhJIiU2MjAxYTc0Y2VmOThkOTBjYTFjZTY0OTgzYTE3ZjRlNQY6BkVG--b5b8a725465a8ccb94d0454b46d3086c57c930d7 OLDPW="pw" NEWPW="pw2" sh curl-scripts/auth/change-password.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/change-password" \
  --include \
  --request PATCH \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "'"${OLDPW}"'",
      "new": "'"${NEWPW}"'"
    }
  }'

echo