#!/usr/bin/env bash

# Required parameters inherited from the parent process environment
_SCRIPT_COMMONS="${script_commons:-}"

main() {
  source $_SCRIPT_COMMONS
  parse_args "$@"
  set -- "${POSARGS[@]}"
  debug_script_params

  echo $_CLICKPIE_SERVER_URL_PREFIX/webhooks
#   webhook_url=${_CLICKUP_API_PREFIX}/team/${_WORKSPACE_ID}/webhook

#   curl --request POST --header "Authorization: ${_USER_AUTH_TOKEN}" \
#        --header 'Content-Type: application/json' \
#        --data '{
# "endpoint": "https://19da-94-154-134-13.ngrok-free.app",
# "events": "*"
# }' \
#        $webhook_url

}

main "$@"
