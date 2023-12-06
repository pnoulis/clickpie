import * as env from "../clickpie-commons/src/env.js";
import { log } from "../clickpie-commons/src/log.js";
import { ClickupHttpClient } from "../clickpie-commons/src/ClickupHttpClient.js";
import { HookSqliteClient } from "../clickpie-commons/src/HookSqliteClient.js";
import { Api } from "../clickpie-api/src/index.js";
import { Server } from "../clickpie-server/src/index.js";
import process from "node:process";

const clickup = new ClickupHttpClient({
  username: env.CLICKUP_LOGIN_USERNAME,
  authToken: env.CLICKUP_LOGIN_AUTH_TOKEN,
  url: env.CLICKUP_API_URL,
});

const hooksdb = new HookSqliteClient({
  dbdir: env.LIBDIR_PKG,
});

const api = new Api({
  clickupClient: clickup,
  hooksDbClient: hooksdb,
  publicUrl: env.CLICKPIE_API_URL_PUBLIC,
  localUrl: env.CLICKPIE_API_URL_LOCAL,
});

const server = new Server({
  publicUrl: env.CLICKPIE_SERVER_URL_PUBLIC,
  localUrl: env.CLICKPIE_SERVER_URL_LOCAL,
  api,
});


try {
  await server.start();
  await hooksdb.start();
  process.on("exit", () => {
    hooksdb.stop();
  });
  hooksdb.drop();
  hooksdb.create();
  const hh = await clickup.getHooks({ quite: true });
  hooksdb.add(hh);
} catch (err) {
  log.error(err);
  process.exit(1);
}
