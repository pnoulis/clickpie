#!/usr/bin/env bash

# Get ALL LISTS available to the $AUTHENTICATED_USER
# Given a WORKSPACE, limit the output to LISTS in WORKSPACE
# Given a SPACE, limit the output to LISTS in SPACE of WORKSPACE
# Given a FOLDER, limit the output to LISTS in FOLDER of SPACE in WORKSPACE

# Required parameters inherited from the parent process environment
_SCRIPT_COMMONS="${script_commons:-}"

main() {
  source $_SCRIPT_COMMONS
  parse_args "$@"
  set -- "${POSARGS[@]}"
  debug_script_params
  tempout=$(mktemp)
  example_url=${_CLICKUP_API_PREFIX}/team

  if [[ "${_FOLDER_ID}" != '' ]]; then
    debug 'limit output to lists in folder of space in workspace'
    lists_url=${_CLICKUP_API_PREFIX}/folder/${_FOLDER_ID}/list?archive=false
    curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
         $lists_url > $tempout
  elif [[ "${_SPACE_ID}" != '' ]]; then
    debug 'limit output to lists in space of workspace'
    while read -r folder_id; do
      lists_url=${_CLICKUP_API_PREFIX}/folder/${folder_id}/list?archive=false
      curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
           $lists_url >> $tempout
    done < <(./scripts/get-folders.sh --space=$_SPACE_ID --format=line)
    folderless_lists_url=${_CLICKUP_API_PREFIX}/space/${SPACE_ID}/list?archive=false
    curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
         $folderless_lists_url >> $tempout
  elif [[ "${_WORKSPACE_ID}" != '' ]]; then
    debug 'limit output to lists in workspace'
    while read -r space_id; do
      while read -r folder_id; do
        lists_url=${_CLICKUP_API_PREFIX}/folder/${folder_id}/list?archive=false
        curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
             $lists_url >> $tempout
      done < <(./scripts/get-folders.sh --space=$space_id --format=line)
      folderless_lists_url=${_CLICKUP_API_PREFIX}/space/${space_id}/list?archive=false
      curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
           $folderless_lists_url >> $tempout
    done < <(./scripts/get-spaces.sh --workspace=$_WORKSPACE_ID --format=line)
  else
    debug 'get all lists'
    while read -r workspace_id; do
      while read -r space_id; do
        while read -r folder_id; do
          lists_url=${_CLICKUP_API_PREFIX}/folder/${folder_id}/list?archive=false
          curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
               $lists_url >> $tempout
        done < <(./scripts/get-folders.sh --space=$space_id --format=line)
        folderless_lists_url=${_CLICKUP_API_PREFIX}/space/${space_id}/list?archive=false
        curl --request GET --silent --header "Authorization: ${_USER_AUTH_TOKEN}" \
             $folderless_lists_url >> $tempout
      done < <(./scripts/get-spaces.sh --workspace=$workspace_id --format=line)
    done < <(./scripts/get-workspaces.sh --format=line)
  fi
  jq '.lists[]' $tempout | jq -s '.' | sponge $tempout

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
