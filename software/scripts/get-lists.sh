#!/usr/bin/env bash

# Get LISTS in $FOLDER available to the $AUTHENTICATED_USER

# Required parameters
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
# Optional parameters
_WORKSPACE_ID=
_SPACE_ID=
_FOLDER_ID=
_VERBOSE="${1:-false}"
_DEBUG="${DEBUG:-false}"

if [ "${_USER_AUTH_TOKEN}" == "" ]; then
  echo "Missing CLICKUP_AUTH_TOKEN"
  exit 1
elif [ "${_CLICKUP_API_PREFIX}" == "" ]; then
  echo "Missing CLICKUP_API_PREFIX"
  exit 1
fi

get_workspaces=${_CLICKUP_API_PREFIX}/folder/${_FOLDER_ID}/list?=archived=false
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

parse_param() {
  local param arg
  local -i toshift=0

  if (($# == 0)); then
    return $toshift
  elif [[ "$1" =~ .*=.* ]]; then
    param="${1%%=*}"
    arg="${1#*=}"
  elif [[ "${2-}" =~ ^[^-].+ ]]; then
    param="$1"
    arg="$2"
    ((toshift++))
  fi

  if [[ -z "${arg-}" && ! "${OPTIONAL-}" ]]; then
    echo "${param:-$1} requires an argument"
    exit 1
  fi

  echo "${arg:-}"
  return $toshift
}

parse_args() {
    declare -ga POSARGS=()
    while (($# > 0)); do
        case "${1:-}" in
            -D | --dry-run)
                DRY_RUN=0
                ;;
            -d | --debug)
                DEBUG=0
                ;;
            -h | --help)
                usage
                exit 0
                ;;
            -[a-zA-Z][a-zA-Z]*)
                local i="${1:-}"
                shift
                local rest="$@"
                set --
                for i in $(echo "$i" | grep -o '[a-zA-Z]'); do
                    set -- "$@" "-$i"
                done
                set -- $@ $rest
                continue
                ;;
            --)
                shift
                POSARGS+=("$@")
                ;;
            -[a-zA-Z]* | --[a-zA-Z]*)
                fatal "Unrecognized argument ${1:-}"
                ;;
            *)
                POSARGS+=("${1:-}")
                ;;
        esac
        shift
    done
}

debug() {
  [ ! $DEBUG ] && return
  echo debug: "$@" >&2
}
