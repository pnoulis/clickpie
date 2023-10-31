# Optional parameters
_WORKSPACE_ID="${WORKSPACE_ID:-}"
_SPACE_ID="${SPACE_ID:-}"
_FOLDER_ID="${FOLDER_ID:-}"
_LIST_ID="${LIST_ID:-}"
_OUTPUT_FORMAT=json
declare -i _VERBOSE=0

# Required parameters inherited from the parent process environment
_USER_AUTH_TOKEN="${CLICKUP_AUTH_TOKEN:-}"
_CLICKUP_API_PREFIX="${CLICKUP_API_PREFIX:-}"
_JSON2CSV="${json2csv:-}"

parse_args(){
  declare -ga POSARGS=()
  while (($# > 0)); do
    case "${1:-}" in
      -w | --workspace=* | --workspace*)
        _WORKSPACE_ID="$(parse_param "$@")" || shift $?
        ;;
      -s | --space=* | --space*)
        _SPACE_ID="$(parse_param "$@")" || shift $?
        ;;
      -f | --folder=* | --folder*)
        _FOLDER_ID="$(parse_param "$@")" || shift $?
        ;;
      -l | --list=* | --list*)
        _LIST_ID="$(parse_param "$@")" || shift $?
        ;;
      -v | --verbose=* | --verbose*)
        ((_VERBOSE++))
      ;;
      -F | --format=* | --format*)
        _OUTPUT_FORMAT="$(parse_param "$@")" || shift $?
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
        error "Unrecognized argument ${1:-}"
        ;;
      *)
        POSARGS+=("${1:-}")
        ;;
    esac
    shift
  done
}

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
    fatal "${param:-$1} requires an argument"
  fi

  echo "${arg:-}"
  return $toshift
}

quote() {
  echo \'"$@"\'
}

error() {
  echo "$@"
  exit 1
}

debug() {
  [ ! $DEBUG ] && return
  echo debug: "$@" >&2
}

debug_script_params() {
  debug "Output format: $(quote $_OUTPUT_FORMAT)"
  debug "Verbosity: $(quote $_VERBOSE)"
  debug "Clickup Authorization token: $(quote $_USER_AUTH_TOKEN)"
  debug "Clickup API prefix: $(quote $_CLICKUP_API_PREFIX)"
  debug "Script json2csv: $(quote $_JSON2CSV)"
  debug "Script commons: $(quote $_SCRIPT_COMMONS)"
  debug "Workspace: $(quote $_WORKSPACE_ID)"
  debug "Space: $(quote $_SPACE_ID)"
  debug "Folder: $(quote $_FOLDER_ID)"
  debug "List: $(quote $_LIST_ID)"
}
