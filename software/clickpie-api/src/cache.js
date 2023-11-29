import fs from "node:fs/promises";
import { CACHEDIR } from "clickpie-commons/env";
import { Graph } from "clickpie-commons/graph";

const GRAPH_CACHE = CACHEDIR + "/" + "graph.json";

async function cacheGraph(graph) {
  let file;
  try {
    log.debug(`Opening ${GRAPH_CACHE}`);
    file = await fs.open(GRAPH_CACHE, "w");
    file.write(graph.toJSON(), { encoding: "utf8" });
  } catch (err) {
    log.debug("Failed to open GRAPH_CACHE");
    if (err.code === "ENOENT") {
      try {
        log.debug(`Creating CACHEDIR`);
        await fs.mkdir(CACHEDIR, { recursive: true });
        return await cacheGraph(graph);
      } catch (err) {
        log.debug("Failed to create CACHEDIR");
        log.error(err);
      }
    }
    log.error(err);
    throw err;
  } finally {
    await file?.close();
  }
}

async function getCachedGraph() {
  let file;
  try {
    file = await fs.open(GRAPH_CACHE, "r");
    const cachedGraph = await file.readFile({ encoding: "utf8" });
    return Graph.fromJSON(cachedGraph);
  } finally {
    await file?.close();
  }
}

function updateCachedGraph(clickup) {}
export { cacheGraph, getCachedGraph, updateCachedGraph };
