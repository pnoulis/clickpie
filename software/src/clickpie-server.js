import * as env from "../clickpie-commons/src/env.js";
import { getClickupClient } from "../clickpie-commons/src/ClickupClient.js";
import { log } from "../clickpie-commons/src/log.js";
import { Api } from "../clickpie-api/src/index.js";
import { Server } from "../clickpie-server/src/index.js";
import process from "node:process";
import { hooksdb } from "../clickpie-commons/src/hooksdb.js";

const api = new Api({
  clickupClient: getClickupClient(),
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
  const hh = await api.getHooks({ quite: true });
  hooksdb.drop();
  hooksdb.create();
  hooksdb.add(hh);
} catch (err) {
  log.error(err);
  process.exit(1);
}
