import { getUnvisitedNeighbors } from "../Algorithms/Dijkstra";
import Heap from "heap";
import { euclideanDistance } from "../Algorithms/Astar";

var yetToVisit;

export function greedyBestFS(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const visitedNodesInOrder = [];

  yetToVisit = new Heap(function(a, b) {
    return a.fCost - b.fCost;
  });

  initializeCosts(grid);

  startNode.fCost = 0;

  yetToVisit.updateItem(startNode);
  yetToVisit.heapify();

  while (yetToVisit.size() > 0) {
    const currNode = yetToVisit.pop();

    if (typeof currNode === "undefined") return visitedNodesInOrder;
    if (currNode.fCost === Infinity) return visitedNodesInOrder;

    if (currNode.isWall) continue;

    currNode.visited = true;

    visitedNodesInOrder.push(currNode);

    if (currNode === finishNode) return visitedNodesInOrder;

    const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);

    for (const neighbor of unvisitedNeighbours) {
      if (!neighbor.isWall) {
        const hCost = euclideanDistance(
          neighbor.col,
          finishNode.col,
          neighbor.row,
          finishNode.row
        );

        if (neighbor.fCost > hCost) {
          neighbor.fCost = hCost; //no g cost
          neighbor.previousNode = currNode;
          yetToVisit.updateItem(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function initializeCosts(grid) {
  for (let row of grid) {
    for (let node of row) {
      node.fCost = Infinity;
      node.hCost = Infinity;
      yetToVisit.push(node);
    }
  }
}

//ORIGINAL
// export function greedyBestFS(grid, startNode, finishNode) {
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }

//   const visitedNodesInOrder = [];

//   startNode.distance = 0;

//   yetToVisit = new Heap(function(a, b) {
//     return a.fCost - b.fCost;
//   });

//   startNode.fCost = 0;

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

//         neighbor.fCost = hCost; //no g cost

//         neighbor.visited = true;
//         neighbor.previousNode = currNode;
//         neighbor.distance = 0;
//         yetToVisit.push(neighbor);
//       }
//     }
//   }

//   return visitedNodesInOrder;
// }

// function greedyBestFScommented(grid, startNode, finishNode) {
//   // check for invalid inputs
//   if (!startNode || !finishNode || startNode === finishNode) {
//     return false;
//   }
//   const visitedNodesInOrder = [];

//   // create a priority queue such that yetToVisit.pop() is the node with the lowest fCost
//   yetToVisit = new Heap(function(a, b) {
//     return a.fCost - b.fCost;
//   });

//   // set the hCost and fCost of every node to Infinity
//   initializeCosts(grid);

//   // add the startNode to priority queue
//   startNode.fCost = 0;
//   yetToVisit.updateItem(startNode);
//   yetToVisit.heapify();

//   while (yetToVisit.size() > 0) {
//     const currNode = yetToVisit.pop();

//     // if the currNode is undefined of the fCost is Infinity, return the list of visited nodes
//     if (typeof currNode === "undefined") return visitedNodesInOrder;
//     if (currNode.fCost === Infinity) return visitedNodesInOrder;

//     // if the node is a wall, go back to the loop again
//     if (currNode.isWall) continue;

//     // mark the node as visited and add it to the list of visited nodes
//     currNode.visited = true;
//     visitedNodesInOrder.push(currNode);

//     // if the node equals the finish node, return the list of visited nodes
//     if (currNode === finishNode) return visitedNodesInOrder;

//     // for all unvisited neighbors of the node, calculate h(n),
//     // we will be using euclidean distance. Then check the condition of f(n) and
//     // update the costs of the node respectively.
//     const unvisitedNeighbours = getUnvisitedNeighbors(currNode, grid);
//     for (const neighbor of unvisitedNeighbours) {
//       if (!neighbor.isWall) {
//         const hCost = euclideanDistance(
//           neighbor.col,
//           finishNode.col,
//           neighbor.row,
//           finishNode.row
//         );

//         if (neighbor.hCost > hCost) {
//           neighbor.fCost = hCost; //no g cost
//           neighbor.previousNode = currNode;
//           yetToVisit.updateItem(neighbor);
//         }
//       }
//     }
//   }

//   return visitedNodesInOrder;
// }
