#!/usr/bin/env sh

curl -v \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{
    "normals":"20",
    "onlyMornings":"2",
    "onlyMorningsNoWeekends":"2",
    "chiefs":"5"
  }' \
  http://localhost:8000
