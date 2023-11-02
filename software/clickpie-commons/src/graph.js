/*
  An Adjacency-list tree is one solution of many to the question:

  How might one represent a tree, directed or undirected using
  a programming language as the means of expression?

  The adjacency-list representation of a graph G = (V,E) consists of an array
  *Adj* of |V| lists, one for each vertex in V. For each u e V, the adjacency
  list Adj[u] contains all vertices v such that there is an edge (u, v) e E.
  Thatis, Adj[u] consists of all the vertices adjacent to u in G.
  (Introduction to algorithms, Thomas H. Cormen, 3rd ed)

  As an abstraction, an Adjacency-list representation is well defined. However
  implementing it necessiates technical choices which drive the complexity,
  speed,ease of use, effectiveness and even allowed operations of the resulting
  structure

  [USAGE]

  const graph = new Graph();
  const root = 'root';
  const vertexA = { id: "somid", ...props };
  const vertexB = { id: "nodid", ...props };

  graph.addVertex(root);
  graph.addVertex(vertexA);
  graph.addVertex(vertexB);

  graph.addEdge(root, vertexA);
  graph.addEdge(root, vertexB);

  graph.traverse(root, (vertex, stop) => {
  if (vertex.id = 'somid') stop();
  })

*/

class Graph {
  /* verteces: u, v, w */
  /* edges: e, f */
  /* source vertex in BFS: s */
  constructor(verteces) {
    verteces ||= [null];
    this.adjacencyList = new Map();

    /* auto scaffolding */
    this.root = verteces.at(0);
    this.addVertex(this.root);
    for (const vertex of verteces.slice(1)) {
      this.addVertex(vertex);
      this.addEdge(this.root, vertex);
    }
  }
  addVertex(u) {
    this.adjacencyList.set(u, new Set());
  }
  addEdge(u, v) {
    this.adjacencyList.get(u).add(v);
    this.adjacencyList.get(v).add(u);
  }
  getNeighboors(u) {
    return this.adjacencyList.get(u);
  }
  hasEdge(u, v) {
    return this.adjacencyList.get(u).has(v);
  }
  hasVertex(u) {
    return this.adjacencyList.has(u);
  }
  traverse(s, cb) {
    const V = this.adjacencyList.length;
    const visited = new Map();
    const queue = [];
    const stop = function () {
      queue.length = 0;
    };
    if (typeof cb !== "function") {
      cb = function (vertext, stop) {};
    }

    for (let i = 0; i < V; i++) {
      visited[i] = false;
    }

    visited.set(s, true);
    queue.push(s);

    while (queue.length > 0) {
      s = queue[0];
      console.log(s);
      queue.shift();

      for (const vertex of this.getNeighboors(s)) {
        if (!visited.has(vertex)) {
          visited.set(vertex, true);
          queue.push(vertex);
        }
      }
      cb(s, stop);
    }
  }
  /* For development purposes */
  log() {
    console.dir(this.adjacencyList, { depth: null });
  }
}

export { Graph };
