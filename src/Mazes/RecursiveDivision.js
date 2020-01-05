var nodesToBeWalls = [];
var typeOfMaze = "";

export function recursiveDivision(
  grid,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  orientation,
  type
) {
  nodesToBeWalls = [];
  typeOfMaze = type;

  recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation);
  return nodesToBeWalls;
}

export function recursiveDivisionMaze(
  grid,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  orientation
) {
  if (rowEnd < rowStart || colEnd < colStart) return;

  if (orientation === "HORIZONTAL") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }

    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    const row = grid[currentRow];
    for (const node of row) {
      if (
        node.row === currentRow &&
        !node.isStart &&
        !node.isFinish &&
        node.col !== colRandom &&
        !node.visited &&
        node.col >= colStart - 1 &&
        node.col <= colEnd + 1
      ) {
        console.log(node);
        node.isWall = true;
        node.visited = true;
        nodesToBeWalls.push(node);
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        switchType(orientation, orientation, "VERTICAL")
      );
    } else {
      recursiveDivisionMaze(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        switchType("VERTICAL", "VERTICAL", "VERTICAL")
      );
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        switchType(orientation, orientation, "VERTICAL")
      );
    } else {
      recursiveDivisionMaze(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        switchType("VERTICAL", "VERTICAL", "VERTICAL")
      );
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      const nodes = grid[row];
      const node = nodes[currentCol];
      if (
        !node.isStart &&
        !node.isFinish &&
        node.col === currentCol &&
        !node.visited &&
        node.row >= rowStart - 1 &&
        node.row <= rowEnd + 1 &&
        node.row !== rowRandom
      ) {
        node.visited = true;
        node.isWall = true;
        nodesToBeWalls.push(node);
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        switchType("HORIZONTAL", "HORIZONTAL", orientation)
      );
    } else {
      recursiveDivisionMaze(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        switchType(orientation, "HORIZONTAL", orientation)
      );
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        switchType("HORIZONTAL", "HORIZONTAL", "HORIZONTAL")
      );
    } else {
      recursiveDivisionMaze(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        switchType(orientation, "HORIZONTAL", orientation)
      );
    }
  }
}

function switchType(maze1, maze2, maze3) {
  if (typeOfMaze === "regularMaze") {
    return maze1;
  } else if (typeOfMaze === "horizontalMaze") {
    return maze2;
  } else if (typeOfMaze === "verticalMaze") {
    return maze3;
  }
}

// export function recursiveDivision(grid, x, y, width, height, orientation) {
//   nodesToBeWalls = [];
//   recursiveDivisionHelper(grid, x, y, width, height, orientation);
//   return nodesToBeWalls;
// }

// function recursiveDivisionHelper(grid, x, y, width, height, orientation) {
//   if (width < 4 || height < 4) return;

//   let horizontal = orientation === "HORIZONTAL";

//   //where wall is drawn
//   let wx = x + (horizontal ? 0 : getRndInteger(0, width - 3));
//   let wy = y + (horizontal ? getRndInteger(0, height - 3) : 0);

//   //passage
//   let px = wx + (horizontal ? getRndInteger(0, width - 1) : 0);
//   let py = wy + (horizontal ? 0 : getRndInteger(0, height - 1));

//   //direction of wall
//   let dx = horizontal ? 1 : 0;
//   let dy = horizontal ? 0 : 1;

//   //length of wall
//   let length = horizontal ? width : height;

//   //direction wall is perpendicular to
//   //let dir = horizontal ? "S" : "E";

//   console.log(wx, wy, px, py, length, horizontal);

//   for (let i = 0; i < length; i++) {
//     const node = grid[wy][wx];
//     if (wx !== px || wy !== py) {
//       if (
//         !node.isStart &&
//         !node.isFinish &&
//         !node.isVisited &&
//         //!containsPassage(node, grid) &&
//         !node.isPassage
//       ) {
//         node.isWall = true;
//         node.isVisited = true;
//         node.isPassage = false;
//         nodesToBeWalls.push(node);
//       }
//     } else {
//       node.isPassage = true;
//     }
//     wx += dx;
//     wy += dy;
//   }

//   //   let nx = x;
//   //   let ny = y;
//   //   let w = horizontal ? width : wx - x + 1;
//   //   let h = horizontal ? wy - y + 1 : height;
//   //   recursiveDivisionHelper(grid, nx, ny, w, h, chooseOrientation(w, h));

//   //   nx = horizontal ? x : wx + 1;
//   //   ny = horizontal ? wy + 1 : y;
//   //   w = horizontal ? width : x + width - wx - 1;
//   //   h = horizontal ? y + height - wy - 1 : height;
//   //   recursiveDivisionHelper(grid, nx, ny, w, h, chooseOrientation(w, h));

//   const nx = x;
//   const ny = y;
//   const w = horizontal ? width : wx - x + 1;
//   const h = horizontal ? wy - y + 1 : height;
//   recursiveDivisionHelper(grid, nx, ny, w, h, chooseOrientation(w, h));

//   const nxx = horizontal ? x : wx + 1;
//   const nyy = horizontal ? wy + 1 : y;
//   const ww = horizontal ? width : x + width - wx - 1;
//   const hh = horizontal ? y + height - wy - 1 : height;
//   recursiveDivisionHelper(grid, nxx, nyy, ww, hh, chooseOrientation(ww, hh));
// }

// function getRndInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function chooseOrientation(width, height) {
//   if (width < height) {
//     return "HORIZONTAL";
//   } else if (height < width) {
//     return "VERTICAL";
//   } else {
//     return getRndInteger(0, 1) === 0 ? "HORIZONTAL" : "VERTICAL";
//   }
// }

// function containsPassage(node, grid) {
//   var neighbors = getAllFourNeighbors(node, grid);
//   for (var x of neighbors) {
//     if (x.isPassage) {
//       //console.log("REACHEDDDD");
//       return true;
//     }
//   }
//   return false;
// }

// function getAllFourNeighbors(node, grid) {
//   const neighbors = [];
//   const { col, row } = node;
//   if (row > 0) neighbors.push(grid[row - 1][col]);
//   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
//   if (col > 0) neighbors.push(grid[row][col - 1]);
//   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
//   return neighbors;
// }
