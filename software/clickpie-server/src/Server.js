import { default as Koa } from "koa";
import { koaBody } from "koa-body";
import { router } from "./router.js";
import { URL } from "node:url";

class Server {
  constructor({ port, publicUrl, localUrl } = {}) {
    this.public = publicUrl instanceof URL ? publicUrl : new URL(publicUrl);
    this.local = localUrl instanceof URL ? localUrl : new URL(localUrl);
    this.public.port ||= port;
    this.local.port ||= port;
    log.debug(this.public);
    log.debug(this.local);
  }
}

Server.prototype.start = async function () {
  if (!this.local.port) {
    throw new Error(`Port '${this.local.port}' is not a valid PORT`);
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
  this.server.use(router.routes());

  this.server.listen(this.local.port, () =>
    log.info(`Server listening on port: ${this.local.port}`),
  );
};

export { Server };
