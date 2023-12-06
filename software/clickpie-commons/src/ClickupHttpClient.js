import { Http } from "./Http.js";
import { ERR_INVALID_ARG_VALUE } from "clickpie-commons/err";

class ClickupHttpClient extends Http {
  constructor({ username, authToken, url } = {}) {
    super({ username, authToken, url });
  }
  getWorkspaces({ quiet = false } = {}) {
    return this.get("/team")
      .then((res) => (res.teams?.length < 1 ? [] : res.teams))
      .then((ww) => (quiet ? ww.map((w) => w.id) : ww));
  }
  getHooks({ quiet = false } = {}) {
    return this.getWorkspaces({ quiet: true })
      .then((ww) =>
        Promise.all(ww.map((workid) => this.get(`/team/${workid}/webhook`))),
      )
      .then((ww) => ww.map((w) => w.webhooks).flat())
      .then((hh) => (quiet ? hh.map((h) => h.id) : hh));
  }
  createHook({ workid, ...hook } = {}) {
    return this.post(`team/${workid}/webhook`, hook);
  }
}

export { ClickupHttpClient };
