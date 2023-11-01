import { default as KoaRouter } from "@koa/router";
import * as api from 'clickpie-api';

const router = new KoaRouter();
router.get("/", function (ctx) {
  ctx.body = "index route";
});

router.get('/api/getWebhooks', function (ctx) {

})

router.get("(.*)", function (ctx) {
  ctx.body = "fallback route";
});

export { router };
