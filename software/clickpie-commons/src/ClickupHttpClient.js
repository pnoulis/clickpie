import { Http } from "./http.js";
import {
  CLICKUP_API_PREFIX,
  CLICKUP_LOGIN_USERNAME,
  CLICKUP_LOGIN_TOKEN,
} from "./env.js";

function createClickupHttpClient({ url, authToken, username } = {}) {
  return new Http({
    username: username || CLICKUP_LOGIN_USERNAME,
    url: url || CLICKUP_API_PREFIX,
    authToken: authToken || CLICKUP_LOGIN_TOKEN,
  });
}

export { createClickupHttpClient };
