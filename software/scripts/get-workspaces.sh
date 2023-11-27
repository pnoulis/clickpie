#!/usr/bin/env bash

# Get WORKSPACES available to the $AUTHENTICATED_USER

# Required parameters inherited from the parent process environment
_SCRIPT_COMMONS="${script_commons:-}"

main() {
  source $_SCRIPT_COMMONS
  parse_args "$@"
  set -- "${POSARGS[@]}"
  debug_script_params
  tempout=$(mktemp)
  workspaces_url=${_CLICKUP_API_PREFIX}/team

  curl --request GET \
       --silent \
       --header "Authorization: ${_USER_AUTH_TOKEN}" \
       $workspaces_url > $tempout

  case $_VERBOSE in
    0)
      # Show just ID's
      case $_OUTPUT_FORMAT in
        json)
          jq '.teams[].id' $tempout | jq -s '.'
          ;;
        csv)
          jq '.teams[] | { id: .id }' $tempout | jq -s '.' | jq -rf $_JSON2CSV
          ;;
        line)
          jq -r '.teams[].id' $tempout
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
          jq '.teams[] | { id: .id, name: .name }' $tempout | jq -s '.'
        ;;
        csv)
          jq '.teams[] | { id: .id, name: .name }' $tempout | jq -s '.' | jq -rf $_JSON2CSV
        ;;
        line)
          jq '.teams[] | { id: .id, name: .name }' $tempout | jq -s '.' | jq -rf $_JSON2CSV | tail --lines=+2 | sed 's/,/ /g'
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
          cat $tempout | jq -r '.teams'
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
