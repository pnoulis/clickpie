import { Http } from "./http.js";
import { CLICKUP_API_PREFIX, CLICKUP_LOGIN_TOKEN } from "./env.js";

function Clickup({ url, authToken } = {}) {
  this.http = new Http({
    url: url || CLICKUP_API_PREFIX,
    authToken: authToken || CLICKUP_LOGIN_TOKEN,
  });
}

export { Clickup };
