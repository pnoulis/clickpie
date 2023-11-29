import { default as Koa } from "koa";
import { koaBody } from "koa-body";
import { URL } from "node:url";
import { createApiRoutes } from "./api-routes.js";
class Server {
  constructor({ publicUrl, localUrl, api } = {}) {
    this.url = {
      public: publicUrl instanceof URL ? publicUrl : new URL(publicUrl),
      local: localUrl instanceof URL ? localUrl : new URL(localUrl),
    };
    this.api = api;
    log.trace(this.public);
    log.trace(this.local);
  }
}

Server.prototype.start = async function () {
  if (!this.url.local.port) {
    throw new Error(`Port '${this.url.local.port}' is not a valid PORT`);
  }
  this.server = new Koa();

  // Attaching middleware
  this.server.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  });
  this.server.use(koaBody());
  this.server.use(async (ctx, next) => {
    log.info(
      `CLICKPIE-SERVER REQ ${ctx.method} ${ctx.request
        .get("Content-Type")
        .split(";")
        .at(0)} ${ctx.path}`,
    );
    log.trace(ctx.request.headers);
    log.info(ctx.request.body);
    try {
      await next();
      log.info(
        `CLICKPIE-SERVER RES ${ctx.method} ${ctx.response
          .get("Content-Type")
          .split(";")
          .at(0)} ${ctx.path}`,
      );
      log.trace(ctx.response.headers);
      log.info(ctx.body);
    } catch (err) {
      log.error(err);
      ctx.status = 500;
    }
  });
  this.server.use(createApiRoutes(this.api));

  this.server.listen(this.url.local.port, () =>
    log.info(`Server listening at port: ${this.url.local.port}`),
  );
};

export { Server };
