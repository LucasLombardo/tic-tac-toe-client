# TOKEN="BAhJIiU1OTExMTE4OGExYzg5ZTkxOTRjNTg2NWU0ZTZiNGY2MAY6BkVG--6eafb11d0c34a59dfd226e81582730b79da2b43e" sh curl-scripts/auth/sign-out.sh

curl "https://tic-tac-toe-wdi.herokuapp.com/sign-out" \
  --include \
  --request DELETE \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}"

echo
