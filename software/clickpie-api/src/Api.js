import { ERR_INVALID_ARG_VALUE } from "clickpie-commons/err";

class Api {
  constructor({ clickupClient, webhookUrl } = {}) {
    this.clickup = clickupClient;
    this.webhookUrl = webhookUrl;
  }
  getWorkspaces({ quiet = false } = {}) {
    return this.clickup
      .get("/team")
      .then((res) => (res.teams?.length < 1 ? [] : res.teams))
      .then((wss) => (quiet ? wss.map((ws) => ws.id) : wss));
  }
  getHooks({ quiet = false } = {}) {
    return this.getWorkspaces({ quiet: true })
      .then((wss) =>
        Promise.all(
          wss.map((workid) => this.clickup.get(`/team/${workid}/webhook`)),
        ),
      )
      .then((wss) => wss.map((ws) => ws.webhooks).flat())
      .then((hooks) => (quiet ? hooks.map((hook) => hook.id) : hooks));
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
    const hookend = this.webhookUrl + "/" + name;
    log.debug(`create hook: ${hookend}`);
  }
}

export { Api };
