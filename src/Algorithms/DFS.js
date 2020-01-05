import { getUnvisitedNeighbors } from "../Algorithms/Dijkstra";

var visitedNodesInOrder = [];
var finished = 0;

export function DFS(grid, startNode, finishNode) {
  visitedNodesInOrder = [];
  return DFSHelper(grid, startNode, finishNode);
}

function DFSHelper(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  if (startNode.isWall || startNode.visited) return;
  startNode.visited = true;

  visitedNodesInOrder.push(startNode);

  if (startNode === finishNode) {
    finished = 1;
    return visitedNodesInOrder;
  }

  var unvisitedNeighbours = getUnvisitedNeighbors(startNode, grid);

  for (var neighbour of unvisitedNeighbours) {
    if (!neighbour.isWall && !neighbour.visited) {
      neighbour.previousNode = startNode;
      if (finished === 1) {
        return visitedNodesInOrder;
      }
      DFSHelper(grid, neighbour, finishNode);
      if (finished === 1) {
        return visitedNodesInOrder;
      }
    }
  }

  return visitedNodesInOrder;
}

// // THIS IS ITERATIVE DEPTH FIRST SEARCH USING STACK
// function DFScommented(grid, startNode, finishNode) {
//   //check for invalid inputs
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   const visitedNodesInOrder = [];
//   var s = new Stack(); //create a new stack

//   //initialize the start node distance to 0 and add it to the stack
//   startNode.distance = 0;
//   s.push(startNode);

//   while (s.length !== 0) {
//     var currNode = s.pop();

//     //guard against invalid nodes
//     if (typeof currNode === "undefined") return visitedNodesInOrder;

//     //if the node is a wall, repeat the loop again
//     if (currNode.isWall) continue;

//     //mark the node as visited and add it to the list of visited nodes
//     currNode.visited = true;
//     visitedNodesInOrder.push(currNode);

//     //if the current node equals the finish node, return the list of visited nodes
//     if (currNode === finishNode) return visitedNodesInOrder;

//     //get univisited neighbors of the current node and add them to the stack
//     const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);
//     for (const neighbor of unvisitedNeighbours) {
//       if (!neighbor.isWall) {
//         s.push(neighbor);
//         neighbor.visited = true;
//         neighbor.previousNode = currNode;
//       }
//     }
//   }
// }

// /*

//   stack.js

//   A function to represent a stack

//   Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
//   of the CC0 1.0 Universal legal code:

//   http://creativecommons.org/publicdomain/zero/1.0/legalcode

//   */
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
