import { Http } from "./Http.js";

function ClickupClient({url, authToken, username } = {}) {
  return new Http({
    username,
    url,
    authToken,
  })
}

export { ClickupClient };
