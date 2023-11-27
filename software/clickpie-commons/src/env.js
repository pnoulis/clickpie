import { detectRuntime, detectMode, getEnvar } from "js_utils/environment";

const RUNTIME = detectRuntime();
const MODE = detectMode();
const LOGLEVEL = getEnvar("LOGLEVEL", false, "trace");
const PORT = getEnvar("PORT", false, 5173);
const CACHEDIR = getEnvar("CACHEDIR", false, "/tmp");
const CACHE_GRAPH_BASENAME = getEnvar("CACHE_GRAPH_BASENAME", false, "clickpie-graph.json");
const CLICKUP_API_URL_PREFIX = getEnvar("CLICKUP_API_PREFIX", true);
const CLICKUP_LOGIN_USERNAME = getEnvar("CLICKUP_LOGIN_USERNAME", true);
const CLICKUP_LOGIN_AUTH_TOKEN = getEnvar("CLICKUP_LOGIN_TOKEN", true);
const CLICKPIE_SERVER_URL_PREFIX = getEnvar("CLICKPIE_SERVER_URL_PREFIX", true);

export {
  RUNTIME,
  MODE,
  LOGLEVEL,
  PORT,
  CACHEDIR,
  CACHE_GRAPH_BASENAME,
  CLICKUP_API_URL_PREFIX,
  CLICKUP_LOGIN_USERNAME,
  CLICKUP_LOGIN_AUTH_TOKEN,
  CLICKPIE_SERVER_URL_PREFIX,
};
