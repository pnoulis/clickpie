import { log } from "./log.js";
import { Server } from "./server.js";
import * as ENVIRONMENT from "./env.js";

globalThis.log = log;
log.debug(ENVIRONMENT);

const server = new Server({ port: ENVIRONMENT.PORT });

try {
  await server.start();
} catch (err) {
  log.error(err);
  process.exit(1);
}
