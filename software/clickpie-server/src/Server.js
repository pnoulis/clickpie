import { default as Koa } from "koa";
import { koaBody } from "koa-body";
import { URL } from "node:url";
import { createApiRoutes } from "./api-routes.js";
import { log as prettyOut } from "log-parsed-json";

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

  // RESPONSE TIME middleware
  this.server.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  });

  // BODY-PARSER middleware
  this.server.use(koaBody());

  // FILL undefined body middleware
  this.server.use(async (ctx, next) => {
    ctx.request.body ??= {};
    await next();
  });

  // LOGGER middleware
  this.server.use(async (ctx, next) => {
    log.info(
      `CLICKPIE-SERVER REQ ${ctx.method} ${ctx.request
        .get("Content-Type")
        .split(";")
        .at(0)} ${ctx.path}`,
    );
    log.trace(ctx.request.headers);
    log.info(ctx.request.body);
    log.info(
      "--------------------------------------------------------------------------------",
    );
    try {
      await next();
      log.info(
        `CLICKPIE-SERVER RES ${ctx.method} ${ctx.response
          .get("Content-Type")
          .split(";")
          .at(0)} ${ctx.path}`,
      );
      log.trace(ctx.response.headers);
      prettyOut(ctx.body);
    } catch (err) {
      log.info(
        `CLICKPIE-SERVER RES ${ctx.method} ${ctx.response
          .get("Content-Type")
          .split(";")
          .at(0)} ${ctx.path}`,
      );
      prettyOut(err);
      ctx.status = err.status || 500;
    }
  });

  // API ROUTES
  this.server.use(createApiRoutes(this.api));

  this.server.listen(this.url.local.port, () =>
    log.info(`Server listening at port: ${this.url.local.port}`),
  );
};

export { Server };
