#!/usr/bin/env bash

# Required parameters
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
_WORKSPACE_ID="${TEAM_ID:-}"
# Optional parameters
_VERBOSE="${1:-false}"


get_shared=${CLICKUP_API_PREFIX}/team/${_WORKSPACE_ID}/shared

# --request, the request METHOD
# --include, include the http response HEADERS in the output
curl --request GET \
     --header "Authorization: ${_USER_AUTH_TOKEN}" \
     $get_shared | jq '.'
