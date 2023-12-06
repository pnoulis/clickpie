import sqlite from "better-sqlite3";
import { LIBDIR_PKG } from "./env.js";
import { mkdir } from "node:fs/promises";

await mkdir(LIBDIR_PKG, { recursive: true });

let db = new sqlite(`${LIBDIR_PKG}/hooks.db`);

const _dropHooksTable = db.prepare(`
DROP TABLE IF EXISTS 'hooks'
`);

const _hasHooksTable = db.prepare(`
SELECT name from sqlite_schema
WHERE type = 'table'
AND name = 'hooks'
`);

const _createHooksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS 'hooks' (
id TEXT PRIMARY KEY,
userid INTEGER,
team_id INTEGER,
endpoint TEXT,
client_id TEXT,
events TEXT,
task_id INTEGER,
list_id INTEGER,
folder_id INTEGER,
space_id INTEGER,
status TEXT,
fail_count INTEGER,
secret TEXT
)`);

_createHooksTable.run();

log.info("Connected to db:hooks");

const _insertHook = db.prepare(`
INSERT INTO 'hooks'
VALUES (
@id,
@userid,
@team_id,
@endpoint,
@client_id,
@events,
@task_id,
@list_id,
@folder_id,
@space_id,
@status,
@fail_count,
@secret
)`);

const _getHooks = db.prepare(`SELECT * from 'hooks'`);

const hooksdb = {
  get() {
    return _getHooks.all().map((h) => {
      h.events = h.events.split(",");
      return h;
    });
  },
  add({
    id,
    userid,
    team_id,
    endpoint,
    client_id,
    events,
    task_id,
    list_id,
    folder_id,
    space_id,
    health,
    secret,
  } = {}) {
    _insertHook.run({
      id,
      userid,
      team_id,
      endpoint,
      client_id,
      events: events.join(","),
      task_id,
      list_id,
      folder_id,
      space_id,
      status: health.status,
      fail_count: health.fail_count,
      secret,
    });
    log.info(`Added new hook:${id}`);
  },
  drop() {
    _dropHooksTable.run();
    log.info("Dropped db:hooks");
  },
  create() {
    _createHooksTable.run();
    log.info("Created db: hooks");
  },
  start() {
    db = new sqlite(`${LIBDIR_PKG}/hooks.db`);
    log.info("Connected to db:hooks");
  },
  stop() {
    db.close();
    log.info("Closed connection to db:hooks");
  }
}

export { hooksdb };
