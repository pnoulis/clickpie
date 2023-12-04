import * as env from "clickpie-commons/env";
import { getClickupClient } from "clickpie-commons/ClickupClient";
import { log } from 'clickpie-commons/log';
import { Api } from "clickpie-api";
import { Server } from "clickpie-server";
import process from 'node:process';

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
} catch (err) {
  log.error(err);
  process.exit(1);
}
