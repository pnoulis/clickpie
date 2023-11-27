import fs from "node:fs/promises";
import { CACHEDIR, CACHE_GRAPH_BASENAME, Graph } from "clickpie-commons";

async function cacheGraph(graph) {
  let file;
  try {
    log.debug(`Opening ${CACHEDIR}/${CACHE_GRAPH_BASENAME}`);
    file = await fs.open(CACHEDIR + '/' + CACHE_GRAPH_BASENAME, "w");
    file.write(graph.toJSON(), { encoding: "utf8" });
 } catch (err) {
   log.debug('Failed to open CACHEDIR/CACHE_GRAPH_BASENAME');
   if (err.code === 'ENOENT') {
     try {
       log.debug(`Creating CACHEDIR`);
       await fs.mkdir(CACHEDIR, { recursive: true });
       return await cacheGraph(graph);
     } catch(err) {
       log.debug('Failed to create CACHEDIR');
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
    file = await fs.open(CACHEDIR + "/clickpie.graph.json", "r");
    const cachedGraph = await file.readFile({ encoding: "utf8" });
    return Graph.fromJSON(cachedGraph);
  } finally {
    await file?.close();
  }
}

function updateCachedGraph(clickup) {}
export { cacheGraph, getCachedGraph, updateCachedGraph };
