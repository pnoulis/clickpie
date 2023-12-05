import { URL } from "node:url";
import { ERR_INVALID_ARG_VALUE } from "clickpie-commons/err";

class Api {
  constructor({ clickupClient, publicUrl, localUrl } = {}) {
    this.clickup = clickupClient;
    this.url = {
      public: publicUrl instanceof URL ? publicUrl : new URL(publicUrl),
      local: localUrl instanceof URL ? localUrl : new URL(localUrl),
    };
    log.trace(this.public);
    log.trace(this.local);
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
  /*
    https://clickup.com/api/clickupreference/operation/CreateWebhook/
   */
  createHook({ hookname, workid, events, ...options } = {}) {
    return new Promise((resolve, reject) => {
      if (!hookname) {
        reject(
          new ERR_INVALID_ARG_VALUE({
            arg: "hookname",
            value: hookname,
            status: 400,
          }),
        );
      } else if (!workid) {
        reject(
          new ERR_INVALID_ARG_VALUE({
            arg: "workid",
            value: workid,
            status: 400,
          }),
        );
      }
      // hook building
      const hook = {
        endpoint: this.url.public.href + "/webhooks/" + hookname,
        events: events?.length > 1 ? events : "*",
        space_id: options.spacid,
        folder_id: options.foldid,
        list_id: options.listid,
        tastk_id: options.taskid,
      };
      log.info(hook);
      this.clickup
        .post(`/team/${workid}/webhook`, hook)
        .then(resolve)
        .catch(reject);
    });
  }
}

export { Api };
