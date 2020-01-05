//run dijkstra's algorithm
//TODO use a min heap for unvisitedNodes!!!!
import Heap from "heap";

var heap;

export function primm(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  heap = new Heap(function(a, b) {
    return a.cost - b.cost;
  });

  makeAllRandomCost(grid);
  const visitedNodesInOrder = [];
  startNode.cost = 0;
  console.log(startNode.isStart);
  //const unvisitedNodes = getAllNodes(grid);
  getAllNodes(grid);
  //heap.push(startNode);

  heap.heapify();
  while (heap.length !== 0) {
    //shift returns first element in array (with the smallest cost)
    const closestNode = heap.pop();
    //console.log(closestNode);

    //if (closestNode.isWall) continue;

    //if (closestNode.cost === Infinity) return visitedNodesInOrder;
    if (closestNode !== undefined || closestNode !== null) {
      console.log(closestNode);
      closestNode.visited = true;

      //append closest node to those visited in order
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }

  return visitedNodesInOrder;
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
}

function makeAllRandomCost(grid) {
  for (const row of grid) {
    for (const node of row) {
      node.cost = Math.floor(Math.random() * 80 + 1);
    }
  }
}

// update the cost for all the neighbors of node in grid
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    if (neighbor.cost > node.cost + 1) {
      neighbor.cost = node.cost + 1;
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
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
