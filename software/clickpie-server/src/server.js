import { default as Koa } from 'koa';
import { koaBody } from 'koa-body';
import process from 'node:process';
import { api } from 'clickpie-api';

const server = new Koa();
server.use(koaBody());
server.use(async function(ctx) {
  console.dir(ctx.request.body, { depth: null });
  ctx.body = 'Hello World!\n';
})

const PORT = parseInt(process.env.PORT);
if (!PORT) {
  console.error(`Port '${process.env.PORT}' is not a valid PORT`);
  process.exit(1);
}

server.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
