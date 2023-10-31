#!/usr/bin/env bash

# Get ALL SPACES available to the $AUTHENTICATED_USER.
# Given a WORKSPACE, limit the output to SPACES in WORKSPACE.

# Required parameters inherited from the parent process environment
_SCRIPT_COMMONS="${script_commons:-}"

main() {
  source $_SCRIPT_COMMONS
  parse_args "$@"
  set -- "${POSARGS[@]}"
  debug_script_params
  tempout=$(mktemp)

  if [[ "${_WORKSPACE_ID:-}" != "" ]]; then
    debug 'limit output to spaces in workspace'
    spaces_url=${_CLICKUP_API_PREFIX}/team/${_WORKSPACE_ID}/space?archived=false
    curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
         $spaces_url > $tempout
  else
    debug 'get all workspaces'
    while read -r workspace_id; do
      spaces_url=${_CLICKUP_API_PREFIX}/team/${workspace_id}/space?archived=false
      curl --request GET \
           --silent \
           --header "Authorization: ${_USER_AUTH_TOKEN}" \
           $spaces_url >> $tempout
    done < <(./scripts/get-workspaces.sh --format=line)
  fi
  cat $tempout | jq '.spaces[]' | jq -s '.' | sponge $tempout

  case $_VERBOSE in
    0)
      # Show just ID's
      case $_OUTPUT_FORMAT in
        json)
          jq '.[].id' $tempout | jq -s '.'
          ;;
        csv)
          jq '.[] | { id: .id }' $tempout | jq -s '.' | jq -rf $_JSON2CSV
          ;;
        line)
          jq -r '.[].id' $tempout
          ;;
        *)
          rm $tempout
          error "Unrecognized output format: $(quote $_OUTPUT_FORMAT)"
          ;;
      esac
      ;;
    1)
      # Show ID's and Names
      case $_OUTPUT_FORMAT in
        json)
          jq '.[] | { id: .id, name: .name }' $tempout | jq -s '.'
        ;;
        csv)
          jq '.[] | { id: .id, name: .name }' $tempout | jq -s '.' | jq -rf $_JSON2CSV
        ;;
        line)
          jq '.[] | { id: .id, name: .name }' $tempout | jq -s '.' | jq -rf $_JSON2CSV | tail --lines=+2 | sed 's/,/ /g'
        ;;
        *)
          rm $tempout
          error "Unrecognized output format: $(quote $_OUTPUT_FORMAT)"
          ;;
      esac
      ;;
    2) # Show ID's, Names, Permissions, ...
      case $_OUTPUT_FORMAT in
        json)
        ;;
        csv)
        ;;
        line)
        ;;
        *)
          rm $tempout
          error "Unrecognized output format: $(quote $_OUTPUT_FORMAT)"
          ;;
      esac
      ;;
    *)
      # Dump response
      case $_OUTPUT_FORMAT in
        json)
          jq '.' $tempout
          ;;
        csv)
          ;;
        line)
          ;;
        *)
          rm $tempout
          error "Unrecognized output format: $(quote $_OUTPUT_FORMAT)"
          ;;
      esac
      ;;
  esac
  rm $tempout
}

main "$@"
