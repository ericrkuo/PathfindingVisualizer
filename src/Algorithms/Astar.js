import { getUnvisitedNeighbors } from "../Algorithms/Dijkstra";
import Heap from "heap";
var yetToVisit;

// export function Astar(grid, startNode, finishNode) {
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   const visitedNodesInOrder = [];

//   initializeCosts(grid);

//   startNode.distance = 0;

//   yetToVisit = new Heap(function(a, b) {
//     return a.fCost - b.fCost;
//   });

//   startNode.fCost = 0;
//   startNode.gCost = 0;

//   yetToVisit.push(startNode);

//   //    yetToVisit.heapify();

//   while (yetToVisit.size() > 0) {
//     //        yetToVisit.heapify();

//     const currNode = yetToVisit.pop();

//     if (typeof currNode === "undefined") return visitedNodesInOrder;

//     if (currNode.isWall) continue;

//     currNode.distance = 0;

//     currNode.visited = true;

//     visitedNodesInOrder.push(currNode);

//     if (currNode === finishNode) return visitedNodesInOrder;

//     const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);

//     for (const neighbor of unvisitedNeighbours) {
//       if (!neighbor.isWall) {
//         const hCost = euclideanDistance(
//           neighbor.col,
//           finishNode.col,
//           neighbor.row,
//           finishNode.row
//         );

//         // const gCost = euclideanDistance(
//         //   neighbor.col,
//         //   startNode.col,
//         //   neighbor.row,
//         //   startNode.row
//         // );

//         neighbor.gCost = currNode.gCost + 1;

//         if (neighbor.fCost > hCost + neighbor.gCost) {
//           neighbor.fCost = hCost + neighbor.gCost; //g cost
//         }

//         //neighbor.fCost = hCost + neighbor.gCost; //g cost

//         neighbor.visited = true;
//         neighbor.previousNode = currNode;

//         neighbor.distance = 0;
//         yetToVisit.push(neighbor);
//       }
//     }
//   }
//   console.log(grid);
//   return visitedNodesInOrder;
// }

export function Astar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const visitedNodesInOrder = [];

  yetToVisit = new Heap(function(a, b) {
    return a.fCost - b.fCost;
  });

  initializeCosts(grid);

  startNode.fCost = 0;
  startNode.gCost = 0;
  startNode.hCost = 0;

  yetToVisit.heapify();

  while (yetToVisit.length !== 0) {
    const currNode = yetToVisit.pop();

    if (typeof currNode === "undefined") return visitedNodesInOrder;

    if (currNode.isWall) continue;
    if (currNode.fCost === Infinity) return visitedNodesInOrder;

    currNode.visited = true;
    console.log(currNode);

    visitedNodesInOrder.push(currNode);

    if (currNode === finishNode) return visitedNodesInOrder;

    const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);

    for (const neighbor of unvisitedNeighbours) {
      if (!neighbor.isWall) {
        let hCost = manhattanDistance(
          neighbor.col,
          finishNode.col,
          neighbor.row,
          finishNode.row
        );
        // if (neighbor.hCost > hCost) {
        //   neighbor.hCost = hCost;
        // }

        // if (neighbor.gCost > currNode.gCost + 1) {
        //   neighbor.gCost = currNode.gCost + 1;
        // }

        // if (neighbor.fCost > neighbor.hCost + neighbor.gCost) {
        //   neighbor.fCost = neighbor.hCost + neighbor.gCost;
        //   neighbor.previousNode = currNode;
        //   yetToVisit.updateItem(neighbor);
        // }

        if (currNode.gCost + 1 < neighbor.gCost) {
          neighbor.hCost = hCost;
          neighbor.gCost = currNode.gCost + 1;
          neighbor.fCost = neighbor.hCost + neighbor.gCost;
          neighbor.previousNode = currNode;
          yetToVisit.updateItem(neighbor);
        }
      }
    }
  }
  console.log(grid);
  return visitedNodesInOrder;
}

// function Astarcommented(grid, startNode, finishNode) {
//   // check for invalid inputs
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }
//   const visitedNodesInOrder = [];

//   // create a priority queue where heap.pop() is the node with the lowest fCost
//   yetToVisit = new Heap(function(a, b) {
//     return a.fCost - b.fCost;
//   });
//   initializeCosts(grid); // make all nodes have fCost, gCost, hCost infinity at first

//   // set the costs of the startNode to 0
//   startNode.fCost = 0;
//   startNode.gCost = 0;
//   startNode.hCost = 0;

//   // create a priority queue using a min-heap
//   yetToVisit.heapify();

//   while (yetToVisit.length !== 0) {
//     const currNode = yetToVisit.pop();

//     // if node is undefined or current node has fCost of infinity, return list of visited nodes
//     if (typeof currNode === "undefined" || currNode.fCost === Infinity)
//       return visitedNodesInOrder;

//     // if the node is a wall, perform loop again
//     if (currNode.isWall) continue;

//     // mark the node as visited and add to the list of visited nodes
//     currNode.visited = true;
//     visitedNodesInOrder.push(currNode);

//     // if the node equals the finishNode, return the list of visited nodes
//     if (currNode === finishNode) return visitedNodesInOrder;

//     // for all unvisited neighbors of the node, calculate h(n),
//     // we will be using manhattan distance. Then check the condition of g(n) and
//     // update the costs of the node respectively.
//     const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);
//     for (const neighbor of unvisitedNeighbours) {
//       if (!neighbor.isWall) {
//         let hCost = manhattanDistance(
//           neighbor.col,
//           finishNode.col,
//           neighbor.row,
//           finishNode.row
//         );

//         if (currNode.gCost + 1 < neighbor.gCost) {
//           neighbor.hCost = hCost;
//           neighbor.gCost = currNode.gCost + 1;
//           neighbor.fCost = neighbor.hCost + neighbor.gCost;
//           neighbor.previousNode = currNode;
//           yetToVisit.updateItem(neighbor);
//         }
//       }
//     }
//   }
//   return visitedNodesInOrder;
// }

export function euclideanDistance(colA, colB, rowA, rowB) {
  const a = Math.abs(colA - colB);
  const b = Math.abs(rowA - rowB);
  const aSquared = Math.pow(a, 2);
  const bSquared = Math.pow(b, 2);
  return Math.pow(aSquared + bSquared, 0.5);
}

export function manhattanDistance(colA, colB, rowA, rowB) {
  const a = Math.abs(colA - colB);
  const b = Math.abs(rowA - rowB);
  return a + b;
}

function initializeCosts(grid) {
  for (let row of grid) {
    for (let node of row) {
      node.fCost = Infinity;
      node.gCost = Infinity;
      node.hCost = Infinity;
      yetToVisit.push(node);
    }
  }
}
