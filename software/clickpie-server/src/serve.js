import { env, log } from "clickpie-commons";
import { Server } from "./Server.js";

globalThis.log = log;

const server = new Server({
  port: env.PORT,
  publicUrl: env.CLICKPIE_SERVER_URL_PREFIX,
  localUrl: "http://localhost",
});

try {
  await server.start();
} catch (err) {
  log.error(err);
  process.exit(1);
}
