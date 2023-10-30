#!/usr/bin/env bash

# Get WORKSPACES available to the $AUTHENTICATED_USER

# Required parameters
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
# Optional parameters
_VERBOSE="${1:-false}"

if [ "${_USER_AUTH_TOKEN}" == "" ]; then
  echo "Missing CLICKUP_AUTH_TOKEN"
  exit 1
elif [ "${_CLICKUP_API_PREFIX}" == "" ]; then
  echo "Missing CLICKUP_API_PREFIX"
  exit 1
fi

get_workspaces=${_CLICKUP_API_PREFIX}/team
tempout=$(mktemp)

# --request, the request METHOD
# --include, include the http response HEADERS in the output
curl --request GET \
     --silent \
     --header "Authorization: ${_USER_AUTH_TOKEN}" \
     $get_workspaces \
  > $tempout

if [ "${_VERBOSE}" == 'false' ]; then
  jq '.teams[] | { id: .id, name: .name }' $tempout | jq -s '.'
else
  jq '.' $tempout
fi

rm $tempout
