import { default as KoaRouter } from "@koa/router";

const router = new KoaRouter();
router.get("/", function (ctx) {
  ctx.body = "index route";
});

router.get("/webhooks/:hookid", function (ctx) {
  const hookid = ctx.params.hookid;
  log.debug("INFO Webhook");
  ctx.body = `INFO webhook ${hookid}`;
  ctx.status = 200;
});

router.post("/webhooks/:hookname", function (ctx) {
  const hookname = ctx.params.hookname;
  const hookid = ctx.request.body.webhook_id;
  const event = ctx.request.body.event;
  log.debug('FIRE webhook');
  ctx.body = `FIRE webhook ${hookname}`;
  ctx.status = 200;
});

router.put('/webhooks/:hookname', function (ctx) {
  const hookname = ctx.params.hookname;
  log.debug('CREATE webhook');
  ctx.body = `CREATE webhook ${hookname}`;
  ctx.status = 200;
})

router.patch('/webhooks/:hookid', function (ctx) {
  const hookid = ctx.params.hookid;
  log.debug('UPDATE webhook');
  ctx.body = `UPDATE webhook ${hookid}`;
  ctx.status = 200;
})

router.del("/webhooks/:hookid", function (ctx) {
  const hookid = ctx.params.hookid;
  log.debug("DELETE webhook");
  ctx.body = `DELETE webhook ${hookid}`;
  ctx.status = 200;
});

router.head("/webhooks/:hookid", function (ctx) {
  const hookid = ctx.params.hookid;
  log.debug("CHECK webhook");
  ctx.body = `CHECK webhook ${hookid}`;
  ctx.status = 200;
});

router.get("(.*)", function (ctx) {
  ctx.body = "fallback route";
});

export { router };
