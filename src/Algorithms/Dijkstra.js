//run dijkstra's algorithm
//TODO use a min heap for unvisitedNodes!!!!
import Heap from "heap";

var heap;

export function dijkstra(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  heap = new Heap(function(a, b) {
    return a.distance - b.distance;
  });

  const visitedNodesInOrder = [];
  startNode.distance = 0;

  //const unvisitedNodes = getAllNodes(grid);
  getAllNodes(grid);
  //heap.push(startNode);

  heap.heapify();
  while (heap.length !== 0) {
    //shift returns first element in array (with the smallest distance)
    const closestNode = heap.pop();
    //console.log(closestNode);

    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.visited = true;

    //append closest node to those visited in order
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }

  //   while (unvisitedNodes.length !== 0) {
  //     sortNodesByDistance(unvisitedNodes);

  //     //shift returns first element in array (with the smallest distance)
  //     const closestNode = unvisitedNodes.shift();

  //     if (closestNode.isWall) continue;

  //     if (closestNode.distance === Infinity) return visitedNodesInOrder;

  //     closestNode.visited = true;

  //     //append closest node to those visited in order
  //     visitedNodesInOrder.push(closestNode);
  //     if (closestNode === finishNode) return visitedNodesInOrder;
  //     updateUnvisitedNeighbors(closestNode, grid);
  //   }
}

// Return all the nodes in the given grid
// puts all nodes into the heap
function getAllNodes(grid) {
  //const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      //nodes.push(node);
      heap.push(node);
    }
  }

  //return nodes;
}

// //sort by smallest to largest distance
// function sortNodesByDistance(unvisitedNodes) {
//   unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
// }

// update the distance for all the neighbors of node in grid
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    if (neighbor.distance > node.distance + 1) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
      //heap.push(neighbor);
      heap.updateItem(neighbor);
    }
  }
}

export function getAllFourNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

// return all the neighbors of node from grid
export function getUnvisitedNeighbors(node, grid) {
  var neighbors = getAllFourNeighbors(node, grid);
  // get rid of neighbors that were already visited
  return neighbors.filter(neighbor => !neighbor.visited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  //  if (!finishNode.visited || finishNode.isWall) return [];
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export function getNodesInShortestPathOrderBiDirectional(
  node,
  visitedNodesInOrder
) {
  //  if (!node.visited || node.isWall) return [];
  if (!arrayContainsGivenNode(visitedNodesInOrder, node)) return [];
  const nodesInShortestPathOrder = [];
  let currentNode = node;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function arrayContainsGivenNode(array, node) {
  if (array === []) return false;
  for (let element of array) {
    if (element.row === node.row && element.col === node.col) {
      return true;
    }
  }
  return false;
}

// //ASSUME: all nodes in the grid have a distance of infinity to begin with
// function dijkstraCommented(grid, startNode, finishNode) {
//   //check for illegal inputs
//   if (!grid || !startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   //create a priority queue of nodes where heap.pop() is the node with the smallest distance
//   var heap = new Heap(function(a, b) {
//     return a.distance - b.distance;
//   });

//   const visitedNodesInOrder = [];

//   //initialize the start nodes distance to 0
//   startNode.distance = 0;

//   //add all the nodes in the grid to the heap
//   for (const row of grid) {
//     for (const node of row) {
//       heap.push(node);
//     }
//   }
//   //create a min-heap
//   heap.heapify();

//   while (heap.length !== 0) {
//     const closestNode = heap.pop();

//     //if the node is a wall, repeat the loop again
//     if (closestNode.isWall) continue;

//     //if the closest node has a distance of infinity, this means there is no shortest path to the finish node
//     if (closestNode.distance === Infinity) return visitedNodesInOrder;

//     //mark the node as visited and add it to the list of visited nodes
//     closestNode.visited = true;
//     visitedNodesInOrder.push(closestNode);

//     //if we arrived at the finish node, return all the nodes we have visited
//     if (closestNode === finishNode) return visitedNodesInOrder;

//     //get all the neighbors surrounding the node
//     const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);

//     //for all unvisited neighbors update their distances respectively
//     for (const neighbor of unvisitedNeighbors) {
//       if (neighbor.distance > closestNode.distance + 1) {
//         neighbor.distance = closestNode.distance + 1;
//         neighbor.previousNode = closestNode;
//         heap.updateItem(neighbor);
//       }
//     }
//   }
// }
