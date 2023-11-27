class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(node) {
    const _node = new Node(node);

    if (this.root === null) {
      this.root = _node;
      return this;
    }

    let current = this.root;
    while (current) {
      console.log("running in while loop");
      if (node.key < current.key) {

      }
    }
  }
}

export { Node, BinarySearchTree };
