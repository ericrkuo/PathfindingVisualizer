import { getUnvisitedNeighbors } from "./Dijkstra";
import {
  NUM_COLUMNS,
  NUM_ROWS
} from "../PathfindingVisualizer/PathfindingVisualizer";

var MAX_DEPTH = 0;
var visitedNodesInOrder = [];
var finished = 0;

export function IDDFS(grid, startNode, finishNode) {
  visitedNodesInOrder = [];
  MAX_DEPTH = NUM_COLUMNS * NUM_ROWS;

  for (let i = 0; i <= MAX_DEPTH; i++) {
    //var newgrid = JSON.parse(JSON.stringify(grid));
    //console.log(grid);
    //var bool = DLS(newgrid, startNode, finishNode, i);
    var bool = DLS(grid, startNode, finishNode, i);
    if (bool === true) return visitedNodesInOrder;
    visitedNodesInOrder = resetVisitedNodes(visitedNodesInOrder);
    //console.log(visitedNodesInOrder);
  }

  return visitedNodesInOrder;
}

function resetVisitedNodes(visited) {
  for (var node of visited) {
    node.visited = false;
  }
  return visited;
}

function DLS(grid, startNode, finishNode, limit) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  if (startNode === finishNode) {
    finished = 1;
    return true;
  }

  if (limit <= 0) return false;

  if (startNode.isWall) return false;

  startNode.visited = true;
  if (!visitedNodesInOrder.includes(startNode)) {
    visitedNodesInOrder.push(startNode);
  }

  var unvisitedNeighbours = getUnvisitedNeighbors(startNode, grid);

  for (var neighbour of unvisitedNeighbours) {
    if (!neighbour.isWall && !neighbour.visited) {
      neighbour.previousNode = startNode;
      if (finished === 1) {
        return true;
      }
      if (DLS(grid, neighbour, finishNode, limit - 1)) {
        return true;
      }
      if (finished === 1) {
        return true;
      }
    }
  }

  return false;
}

// function IDDFScommented(grid, startNode, finishNode) {
//   visitedNodesInOrder = [];
//   // set the depth of how far into the graph you want to go
//   MAX_DEPTH = NUM_COLUMNS * NUM_ROWS;

//   // increase the depth-limit each unsuccessful recursive call where we do not
//   // reach the finish node
//   for (let i = 0; i <= MAX_DEPTH; i++) {
//     var bool = DLS(grid, startNode, finishNode, i);
//     if (bool === true) return visitedNodesInOrder;
//     // reset the nodes we visited and return back to the loop to perform DLS again
//     visitedNodesInOrder = resetVisitedNodes(visitedNodesInOrder);
//   }

//   return visitedNodesInOrder;
// }

// function DLS(grid, node, finishNode, limit) {
//   // check for invalid inputs
//   if (!node || !finishNode || node === finishNode) {
//     return false;
//   }

//   // if we reach the finishNode, mark that we are finished and return true
//   if (node === finishNode) {
//     finished = 1;
//     return true;
//   }

//   // we are only allowed to traverse a certain depth-limit, once the limit approaches
//   // zero, we cannot traverse anymore
//   if (limit <= 0) return false;

//   // if the node is a wall, return
//   if (node.isWall) return false;

//   // mark the node as visited and add it to the nodes we visited
//   node.visited = true;
//   if (!visitedNodesInOrder.includes(node)) {
//     visitedNodesInOrder.push(node);
//   }

//   // get the unvisited neighbors of the node and recursively call DLS
//   // with the depth-limit decremented. If finished has been flagged, we can
//   // return to IDDFS, otherwise, we keep calling DLS until the finishNode
//   // has been reached, or that limit has approached 0
//   var unvisitedNeighbours = getUnvisitedNeighbors(node, grid);

//   for (var neighbour of unvisitedNeighbours) {
//     if (!neighbour.isWall && !neighbour.visited) {
//       neighbour.previousNode = node;
//       if (finished === 1) {
//         return true;
//       }
//       if (DLS(grid, neighbour, finishNode, limit - 1)) {
//         return true;
//       }
//       if (finished === 1) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// export function DLS(grid, startNode, finishNode, limit) {
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   var s = new Stack();
//   startNode.distance = 0;

//   s.push(startNode);

//   while (s.getLength() !== 0) {
//     limit--;
//     if (limit <= 0) {
//       return false;
//     }

//     var currNode = s.pop();

//     if (typeof currNode === "undefined" || currNode.isWall) return false;

//     currNode.distance = 0;
//     currNode.visited = true;
//     visitedNodesInOrder.push(currNode);
//     if (currNode === finishNode) return true;

//     //getUnivisitedNeighbors returns unvisited neighbors left right up down
//     const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);
//     console.log(unvisitedNeighbours);

//     for (const neighbor of unvisitedNeighbours) {
//       if (!neighbor.isWall) {
//         s.push(neighbor);
//         neighbor.visited = true;
//         neighbor.previousNode = currNode;
//         neighbor.distance = 0;
//       }
//     }
//   }
//   return false;
// }

/*
  
  stack.js
  
  A function to represent a stack
  
  Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
  of the CC0 1.0 Universal legal code:
  
  http://creativecommons.org/publicdomain/zero/1.0/legalcode
  
  */
// class Stack {
//   constructor() {
//     // initialise the stack and offset
//     var stack = [];
//     // Returns the length of the stack.
//     this.getLength = function() {
//       return stack.length;
//     };
//     // Returns true if the stack is empty, and false otherwise.
//     this.isEmpty = function() {
//       return stack.length() === 0;
//     };
//     /* Enstacks the specified item. The parameter is:
//      *
//      * item - the item to enstack
//      */
//     this.push = function(item) {
//       stack.push(item);
//     };
//     /* Destacks an item and returns it. If the stack is empty, the value
//      * 'undefined' is returned.
//      */
//     this.pop = function() {
//       // if the stack is empty, return immediately
//       if (stack.length === 0) return undefined;
//       // return the destackd item
//       return stack.pop();
//     };
//     /* Returns the item at the front of the stack (without desueuing it). If the
//      * stack is empty then undefined is returned.
//      */
//     this.peek = function() {
//       return stack.length > 0 ? stack[stack.length() - 1] : undefined;
//     };
//   }
// }
