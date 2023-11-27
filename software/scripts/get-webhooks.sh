#!/usr/bin/env bash

# Get ALL WEBHOOKS available to the $AUTHENICATED_USER
# Given a WORKSPACE, limit the output to WEBHOOKS in WORKSPACE

_SCRIPT_COMMONS="${script_commons:-}"

main() {
  source $_SCRIPT_COMMONS
  parse_args "$@"
  set -- "${POSARGS[@]}"
  debug_script_params
  tempout=$(mktemp)

  if [[ "${_WORKSPACE_ID}" != '' ]]; then
    debug 'limit output to webhooks in workspace'
  else
    debug 'get all wehbooks'
    while read -r workspace_id; do
      webhooks_url=${_CLICKUP_API_PREFIX}/team/${workspace_id}/webhook?archive=false
      curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
           $webhooks_url >> $tempout
    done < <(./scripts/get-workspaces.sh --format=line)
  fi
  jq '.webhooks[]' $tempout | jq -s '.' | sponge $tempout

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
      # Show ID's and URL's
      case $_OUTPUT_FORMAT in
        json)
          jq '.[] | { id: .id, url: .endpoint }' $tempout | jq -s '.'
        ;;
        csv)
          jq '.[] | { id: .id, url: .endpoint }' $tempout | jq -s '.' | jq -rf $_JSON2CSV
        ;;
        line)
          jq '.[] | { id: .id, url: .endpoint }' $tempout | jq -s '.' | jq -rf $_JSON2CSV | tail --lines=+2 | sed 's/,/ /g'
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
