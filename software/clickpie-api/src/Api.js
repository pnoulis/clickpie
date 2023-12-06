import { URL } from "node:url";
import { ERR_INVALID_ARG_VALUE, CustomError } from "clickpie-commons/err";

class Api {
  constructor({ clickupClient, hooksDbClient, publicUrl, localUrl } = {}) {
    this.clickup = clickupClient;
    this.hooksdb = hooksDbClient;
    this.url = {
      public: publicUrl instanceof URL ? publicUrl : new URL(publicUrl),
      local: localUrl instanceof URL ? localUrl : new URL(localUrl),
    };
    log.trace(this.public);
    log.trace(this.local);
  }
  getHooks({ name, hookid, quiet = false } = {}) {
    return this.hooksdb.get();
  }
  /*
    https://clickup.com/api/clickupreference/operation/CreateWebhook/
   */
  async createHook({ name, workid, events, ...options } = {}) {
    if (!name) {
      return Promise.reject(
        new ERR_INVALID_ARG_VALUE({
          arg: "name",
          value: name,
          status: 400,
        }),
      );
    } else if (!workid) {
      return Promise.reject(
        new ERR_INVALID_ARG_VALUE({
          arg: "workid",
          value: workid,
          status: 400,
        }),
      );
    }

    const h = await this.clickup.createHook({
      workid,
      name,
      endpoint: this.url.public.href + "/webhooks/" + name,
      events: events?.length > 1 ? events : "*",
      space_id: options.spacid,
      folder_id: options.foldid,
      list_id: options.listid,
      tastk_id: options.taskid,
    });

    this.hooksdb.add(h);
    return Promise.resolve(h);
  }
}

export { Api };
