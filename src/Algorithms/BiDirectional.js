import { getAllFourNeighbors } from "../Algorithms/Dijkstra";
//import Queue from "../Components/Queue";

export var INTERSECT_NODE_ROW;
export var INTERSECT_NODE_COL;

export function biDirectional(grid, startNode, finishNode) {
  INTERSECT_NODE_ROW = -1;
  INTERSECT_NODE_COL = -1;
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const visitedNodesInOrder = [];

  var qStart = new Queue();
  var qFinish = new Queue();
  qStart.enqueue(startNode);
  qFinish.enqueue(finishNode);

  while (qStart.length !== 0 && qFinish.length !== 0) {
    var currStartNode = qStart.dequeue();
    var currFinishNode = qFinish.dequeue();

    //        console.log(currStartNode);

    if (typeof currStartNode === "undefined") {
      //            console.log(currStartNode);

      return visitedNodesInOrder;
    }
    if (typeof currFinishNode === "undefined") {
      //            console.log(currFinishNode);

      return visitedNodesInOrder;
    }

    currStartNode.visited = true;
    currFinishNode.visited = true;

    visitedNodesInOrder.push(currStartNode);
    visitedNodesInOrder.push(currFinishNode);

    if (isIntersecting(visitedNodesInOrder)) {
      //            finishNode.previousNode = grid[finishNode.row + 1][finishNode.col];
      return visitedNodesInOrder;
    }
    //        console.log(isIntersecting(visitedNodesInOrder));
    //        if (currStartNode === finishNode) return visitedNodesInOrder;
    //        if (currFinishNode === startNode) return visitedNodesInOrder;

    const unvisitedNeighborsStart = getUnvisitedNeighborsStart(
      currStartNode,
      grid
    );
    const unvisitedNeighborsFinish = getUnvisitedNeighborsFinish(
      currFinishNode,
      grid
    );

    for (const neighbor of unvisitedNeighborsStart) {
      if (!neighbor.isWall) {
        //                console.log(neighbor);
        neighbor.visited = true;
        neighbor.visitedByStart = true;
        //                currStartNode.previousNode = neighbor;
        neighbor.previousNode = currStartNode;
        qStart.enqueue(neighbor);
      }
    }

    for (const neighbor of unvisitedNeighborsFinish) {
      if (!neighbor.isWall) {
        //               console.log(neighbor);
        neighbor.visited = true;
        neighbor.visitedByFinish = true;
        //                currFinishNode.previousNode = neighbor;
        neighbor.previousNode = currFinishNode;
        qFinish.enqueue(neighbor);
      }
    }
  }
}

// function biDirectionalCommented(grid, startNode, finishNode) {
//   INTERSECT_NODE_ROW = -1;
//   INTERSECT_NODE_COL = -1;

//   // check for invalid inputs
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   const visitedNodesInOrder = [];

//   // have two queues, one for the start node and another for the finish node
//   // add the start and finish nodes respectively into the queue
//   var qStart = new Queue();
//   var qFinish = new Queue();
//   qStart.enqueue(startNode);
//   qFinish.enqueue(finishNode);

//   while (qStart.length !== 0 && qFinish.length !== 0) {
//     var currStartNode = qStart.dequeue();
//     var currFinishNode = qFinish.dequeue();

//     // mark the two dequeued nodes as visited and add them to the list of visited nodes
//     currStartNode.visited = true;
//     currFinishNode.visited = true;
//     visitedNodesInOrder.push(currStartNode);
//     visitedNodesInOrder.push(currFinishNode);

//     // if there is an intersection, return the list of visited nodes
//     if (isIntersecting(visitedNodesInOrder)) {
//       return visitedNodesInOrder;
//     }

//     // get the neighboring nodes for the two nodes
//     const unvisitedNeighborsStart = getUnvisitedNeighborsStart(
//       currStartNode,
//       grid
//     );
//     const unvisitedNeighborsFinish = getUnvisitedNeighborsFinish(
//       currFinishNode,
//       grid
//     );

//     // for every unvisited neighbor of the two nodes, add them into their respective queues
//     for (const neighbor of unvisitedNeighborsStart) {
//       if (!neighbor.isWall) {
//         neighbor.visited = true;
//         neighbor.visitedByStart = true;
//         neighbor.previousNode = currStartNode;
//         qStart.enqueue(neighbor);
//       }
//     }
//     for (const neighbor of unvisitedNeighborsFinish) {
//       if (!neighbor.isWall) {
//         neighbor.visited = true;
//         neighbor.visitedByFinish = true;
//         neighbor.previousNode = currFinishNode;
//         qFinish.enqueue(neighbor);
//       }
//     }
//   }
// }

function isIntersecting(visitedNodesInOrder) {
  for (var node of visitedNodesInOrder) {
    //        console.log(node);
    if (node.visitedByStart && node.visitedByFinish && !node.isWall) {
      INTERSECT_NODE_ROW = node.row;
      INTERSECT_NODE_COL = node.col;
      return true;
    }
  }
  return false;
}

function getUnvisitedNeighborsStart(node, grid) {
  var neighbors = getAllFourNeighbors(node, grid);

  // keep neighbors that are unvisited OR visited by finishNode
  return neighbors.filter(
    neighbor => neighbor.visitedByFinish || !neighbor.visited
  );
}

function getUnvisitedNeighborsFinish(node, grid) {
  var neighbors = getAllFourNeighbors(node, grid);

  // keep neighbors that are unvisited OR visited by startNode
  return neighbors.filter(
    neighbor => neighbor.visitedByStart || !neighbor.visited
  );
}

/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

function Queue() {
  // initialise the queue and offset
  var queue = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function() {
    return queue.length - offset;
  };

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function() {
    return queue.length === 0;
  };

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item) {
    queue.push(item);
  };

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function() {
    // if the queue is empty, return immediately
    if (queue.length === 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++offset * 2 >= queue.length) {
      queue = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;
  };

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function() {
    return queue.length > 0 ? queue[offset] : undefined;
  };
}
