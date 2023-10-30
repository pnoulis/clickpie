import { default as Koa } from 'koa';
import process from 'node:process';
import { api } from 'clickpie-api';

const server = new Koa();
server.use(async function(ctx) {
  ctx.body = 'Hello World!';
})

const PORT = parseInt(process.env.PORT);
if (!PORT) {
  console.error(`Port '${process.env.PORT}' is not a valid PORT`);
  process.exit(1);
}

server.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
