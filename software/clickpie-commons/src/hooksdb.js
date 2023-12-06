import sqlite from "better-sqlite3";
import { LIBDIR_PKG } from "./env.js";
import { mkdir } from "node:fs/promises";
import { isObject } from "js_utils/misc";
import { CustomError } from "./err.js";
import { smallid } from "js_utils/uuid";

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
id TEXT NOT NULL,
name TEXT NOT NULL,
userid INTEGER,
workid INTEGER,
endpoint TEXT,
events TEXT,
taskid INTEGER,
listid INTEGER,
foldid INTEGER,
spacid INTEGER,
status TEXT,
fail_count INTEGER,
secret TEXT,
PRIMARY KEY (id, name)
)`);

_createHooksTable.run();

log.info("Connected to db:hooks");

const _insertHook = db.prepare(`
INSERT INTO 'hooks'
VALUES (
@id,
@name,
@userid,
@workid,
@endpoint,
@events,
@taskid,
@listid,
@foldid,
@spacid,
@status,
@fail_count,
@secret
)`);

const _getHook = db.prepare(
  `SELECT * from 'hooks' WHERE id = @id OR name = @name`,
);
const _getAllHooks = db.prepare(`SELECT * from 'hooks'`);
const _rmHook = db.prepare(
  `DELETE from 'hooks' WHERE id = @id OR name = @name`,
);

const hooksdb = {
  translateHook(hook) {
    if (!hook) return null;
    hook.events = hook.events.length > 1 ? hook.events.split(",") : [];
    return hook;
  },
  get(hook) {
    return hook
      ? hooksdb.translateHook(
          _getHook.get(
            isObject(hook)
              ? { id: hook.id ?? hook.name, name: hook.name ?? hook.id }
              : { id: hook, name: hook },
          ),
        )
      : _getAllHooks.all().map(hooksdb.translateHook);
  },
  add(...hooks) {
    hooks = hooks.flat();
    var i;
    try {
      for (i = 0; i < hooks.length; i++) {
        _insertHook.run({
          id: hooks[i].id,
          name: hooks[i].name || smallid(),
          userid: hooks[i].userid,
          workid: hooks[i].team_id,
          endpoint: hooks[i].endpoint,
          events: hooks[i].events.join(","),
          taskid: hooks[i].task_id,
          listid: hooks[i].list_id,
          foldid: hooks[i].folder_id,
          spacid: hooks[i].space_id,
          status: hooks[i].health.status,
          fail_count: hooks[i].health.fail_count,
          secret: hooks[i].secret,
        });
        log.info(`Added new hook:${hooks[i].id}`);
      }
    } catch (err) {
      throw new CustomError({
        msg: `Failed to add hook:${hooks[i].id}`,
        hook: hooks[i],
        cause: err,
      });
    }
  },
  rm(...hooks) {
    hooks = hooks.flat();
    let hook;
    for (let i = 0; i < hooks.length; i++) {
      hook = isObject(hooks[i])
        ? {
            id: hooks[i].id ?? hooks[i].name,
            name: hooks[i].name ?? hooks[i].id,
          }
        : { id: hooks[i], name: hooks[i] };
      if (_rmHook.run(hook).changes < 1) {
        throw new CustomError({
          msg: `Failed to delete hook:${hook.id}`,
          hook,
        });
      }
      log.info(`Deleted hook:${hook.id}`);
    }
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
  },
};

export { hooksdb };
