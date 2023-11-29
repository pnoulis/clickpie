import { default as KoaRouter } from "@koa/router";

function createApiRoutes(api) {
  const router = new KoaRouter({ prefix: api.url.local.pathname });

  router.get("/", function (ctx) {
    ctx.body = "index route";
  });

  router.get("/webhooks/:hookid", function (ctx) {
    const hookid = ctx.params.hookid;
    ctx.body = `INFO webhook ${hookid}`;
    ctx.status = 200;
  });

  router.post("/webhooks/:hookname", function (ctx) {
    const hookname = ctx.params.hookname;
    const hookid = ctx.request.body.webhook_id;
    const event = ctx.request.body.event;
    ctx.body = `FIRE webhook ${hookname}`;
    ctx.status = 200;
  });

  router.put("/webhooks/:hookname", function (ctx) {
    const hookname = ctx.params.hookname;
    ctx.body = `CREATE webhook ${hookname}`;
    ctx.status = 200;
  });

  router.patch("/webhooks/:hookid", function (ctx) {
    const hookid = ctx.params.hookid;
    ctx.body = `UPDATE webhook ${hookid}`;
    ctx.status = 200;
  });

  router.del("/webhooks/:hookid", function (ctx) {
    const hookid = ctx.params.hookid;
    ctx.body = `DELETE webhook ${hookid}`;
    ctx.status = 200;
  });

  router.head("/webhooks/:hookid", function (ctx) {
    const hookid = ctx.params.hookid;
    ctx.body = `CHECK webhook ${hookid}`;
    ctx.status = 200;
  });

  router.get("(.*)", function (ctx) {
    ctx.body = "fallback route";
  });

  return router.routes();
}

export { createApiRoutes };
