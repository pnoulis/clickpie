import { Http } from "./Http.js";
import {
  CLICKUP_LOGIN_AUTH_TOKEN,
  CLICKUP_API_URL,
  CLICKUP_LOGIN_USERNAME,
} from "./env.js";

function getClickupClient() {
  return new Http({
    username: CLICKUP_LOGIN_USERNAME,
    authToken: CLICKUP_LOGIN_AUTH_TOKEN,
    url: CLICKUP_API_URL,
  });
}

export { getClickupClient };
