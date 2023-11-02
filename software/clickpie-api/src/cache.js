import fs from "node:fs/promises";
import { CACHEDIR, Graph } from "clickpie-commons";

async function cacheGraph(graph) {
  let file;
  try {
    file = await fs.open(CACHEDIR + "/clickpie.graph.json", "w");
    await file.truncate();
    file.write(graph.toJSON(), { encoding: "utf8" });
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
