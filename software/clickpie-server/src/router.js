import { default as KoaRouter } from "@koa/router";

const router = new KoaRouter();
router.get("/", function (ctx) {
  ctx.body = "index route";
});

router.get('/webhooks/:hookid', function (ctx) {
  console.log('INFO Webhook');
  ctx.body = `INFO webhook ${ctx.params.hookid}`;
  ctx.status = 200;
})

router.post('/webhooks/:hookid', function (ctx) {
  constole.log('FIRE Webhook');
  ctx.body = `FIRE webhook ${ctx.params.hookid}`;
  ctx.status = 200;
})

router.del('/webhooks/:hookid', function (ctx) {
  console.log('DELETE webhook');
  ctx.body = `DELETE webhook ${ctx.params.hookid}`;
  ctx.status = 200;
})

router.trace('/webhooks/:hookid', function (ctx) {
  console.log('CHECK webhook');
  ctx.body = `CHECK webhook ${ctx.params.hookid}`;
  ctx.status = 200;
})

router.get("(.*)", function (ctx) {
  ctx.body = "fallback route";
});

export { router };
