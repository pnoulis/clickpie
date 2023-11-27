import fetch from "node-fetch";
import { ERR_MISSING_ARGS, ERR_HTTP_RESPONSE } from "./err.js";

function parseArguments(path, body, options) {
  switch (arguments.length) {
    case 0:
      throw new ERR_MISSING_ARGS("parseArguments");
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    default:
  }
}

function checkStatus(response) {
  if (response.ok) return response;
  throw new ERR_HTTP_RESPONSE({ url: response.url }, response);
}

function parseJSON(response) {
  return response.json();
}

class Http {
  constructor({ url, authToken, username } = {}) {
    this.url = url;
    this.authToken = authToken;
    this.username = username;
  }
}

Http.prototype.get = function (path, options) {
  log.info(`HTTP GET ${this.url + path}`);
  return fetch(this.url + path, {
    method: "get",
    headers: {
      ["Authorization"]: this.authToken,
    },
  })
    .then(checkStatus)
    .then(parseJSON);
};

Http.prototype.post = function (path, body, options) {
  return fetch(this.url + path, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      ["Content-Type"]: "application/json",
      ["Authorization"]: this.authToken,
    },
  })
    .then(checkStatus)
    .then(parseJSON);
};

export { Http };
