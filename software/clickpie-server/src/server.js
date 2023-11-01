import { default as Koa } from "koa";
import { koaBody } from "koa-body";
import { router } from "./router.js";

function Server({ port } = {}) {
  this.port = parseInt(port);
}

Server.prototype.start = async function () {
  if (!this.port) {
    throw new Error(`Port '${this.port}' is not a valid PORT`);
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

  this.server.listen(this.port, () =>
    log.info(`Server listening on port: ${this.port}`),
  );
};

export { Server };
