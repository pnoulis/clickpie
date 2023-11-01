import { detectRuntime, detectMode, getEnvar } from "js_utils/environment";

const RUNTIME = detectRuntime();
const MODE = detectMode();
const LOGLEVEL = getEnvar("LOGLEVEL", false, "trace");
const PORT = getEnvar("PORT", false, 5173);
const CLICKUP_API_PREFIX = getEnvar("CLICKUP_API_PREFIX", true);
const CLICKUP_LOGIN_TOKEN = getEnvar("CLICKUP_LOGIN_TOKEN", true);

export {
  RUNTIME,
  MODE,
  LOGLEVEL,
  PORT,
  CLICKUP_API_PREFIX,
  CLICKUP_LOGIN_TOKEN,
};
