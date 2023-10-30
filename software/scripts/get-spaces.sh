#!/usr/bin/env bash

# Get SPACES in $WORKSPACE available to the $AUTHENTICATED_USER

# Required parameters
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
_WORKSPACE_ID="${WORKSPACE_ID:-}"
# Optional parameters
_VERBOSE="${1:-false}"

if [ "${_USER_AUTH_TOKEN}" == "" ]; then
  echo "Missing CLICKUP_AUTH_TOKEN"
  exit 1
elif [ "${_CLICKUP_API_PREFIX}" == "" ]; then
  echo "Missing CLICKUP_API_PREFIX"
  exit 1
elif [ "${_WORKSPACE_ID}" == "" ]; then
  echo "Missing WORKSPACE_ID"
  exit 1
fi

get_spaces=${_CLICKUP_API_PREFIX}/team/${_WORKSPACE_ID}/space?=archived=false
tempout=$(mktemp)

curl --request GET \
     --silent \
     --header "Authorization: ${_USER_AUTH_TOKEN}" \
     $get_spaces > $tempout

if [ "${_VERBOSE}" == 'false' ]; then
  jq '.spaces[] | { id: .id, name: .name }' $tempout | jq -s '.'
else
  jq '.' $tempout
fi

rm $tempout
