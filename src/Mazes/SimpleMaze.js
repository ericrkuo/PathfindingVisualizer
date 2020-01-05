export function simpleMaze(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const nodesToBeWalls = [];

  for (const row of grid) {
    for (const node of row) {
      //   if (Math.floor(Math.random() * 8 + 2) <= 4) {
      //     if (Math.floor(Math.random() * 2)) {
      //       if (!node.isStart && !node.isFinish) {
      //         nodesToBeWalls.push(node);
      //         node.isWall = true;
      //       }
      //     }
      //   }

      if (getRndInteger(0, 100) < 50 && getRndInteger(0, 2) < 1) {
        if (!node.isStart && !node.isFinish) {
          nodesToBeWalls.push(node);
          node.isWall = true;
        }
      }
    }
  }

  return nodesToBeWalls;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
