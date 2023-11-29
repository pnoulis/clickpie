import { URL } from "node:url";
import { ERR_INVALID_ARG_VALUE } from "clickpie-commons/err";

class Api {
  constructor({ clickupClient, publicUrl, localUrl } = {}) {
    this.clickup = clickupClient;
    this.url = {
      public: publicUrl instanceof URL ? publicUrl : new URL(publicUrl),
      local: localUrl instanceof URL ? localUrl : new URL(localUrl),
    };
  }
  getWorkspaces({ quiet = false } = {}) {
    return this.clickup
      .get("/team")
      .then((res) => (res.teams?.length < 1 ? [] : res.teams))
      .then((ww) => (quiet ? ww.map((w) => w.id) : ww));
  }
  getHooks({ quiet = false } = {}) {
    return this.getWorkspaces({ quiet: true })
      .then((ww) =>
        Promise.all(
          ww.map((workid) => this.clickup.get(`/team/${workid}/webhook`)),
        ),
      )
      .then((ww) => ww.map((w) => w.webhooks).flat())
      .then((hh) => (quiet ? hh.map((h) => h.id) : hh));
  }
  createHook({ name, events, workid, ...options } = {}) {
    const params = {
      events: events?.length > 1 ? events : "*",
      spacid: options.spacid,
      foldid: options.foldid,
      listid: options.listid,
      taskid: options.taskid,
    };
    if (!name) throw new ERR_INVALID_ARG_VALUE("name", name);
    else if (!workid) throw new ERR_INVALID_ARG_VALUE("workid", workid);
    const hookend = this.url.public.href + "/webhooks/" + name;
    log.debug(`create hook: ${hookend}`);
  }
}

export { Api };
