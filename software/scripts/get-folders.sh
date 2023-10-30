#!/usr/bin/env bash

# Get FOLDERS in $SPACE available to the $AUTHENTICATED_USER

# Required parameters
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
_SPACE_ID="${WORKSPACE_ID:-}"
# Optional parameters
_VERBOSE="${1:-false}"

if [ "${_USER_AUTH_TOKEN}" == "" ]; then
  echo "Missing CLICKUP_AUTH_TOKEN"
  exit 1
elif [ "${_CLICKUP_API_PREFIX}" == "" ]; then
  echo "Missing CLICKUP_API_PREFIX"
  exit 1
elif [ "${_SPACE_ID}" == "" ]; then
  echo "Missing SPACE_ID"
  exit 1
fi


get_folders=${_CLICKUP_API_PREFIX}/team/${_SPACE_ID}/folder?=archived=false
tempout=$(mktemp)

# --request, the request METHOD
# --include, include the http response HEADERS in the output
curl --request GET \
     --silent \
     --header "Authorization: ${CLICKUP_AUTH_TOKEN}" \
     $get_folders > $tempout


if [ "${_VERBOSE}" == 'false' ]; then
  jq '.folders[] | { id: .id, name: .name }' $tempout | jq -s '.'
else
  jq '.' $tempout
fi
