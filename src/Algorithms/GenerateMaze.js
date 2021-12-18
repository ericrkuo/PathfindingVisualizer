export function generateMazeAnimations(grid, numRows, numCols) {
  var animations = [];
  //mark all nodes as walls.
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      grid[i][j].isWall = true;
      //            animations.push(grid[i][j]);  //  Do we need to push this??
    }
  }
  //pick random cell, mark it as a room, add the walls of the cell to the wall list
  const randomRow = getRandomInt(0, numRows - 1);
  const randomCol = getRandomInt(0, numCols - 1);
  grid[randomRow][randomCol].isWall = false;
  animations.push(grid[randomRow][randomCol]); //START NODE

  var listOfFrontierNodes = [];

  getFrontierNodes(
    grid,
    listOfFrontierNodes,
    randomRow,
    randomCol,
    numRows,
    numCols
  );

  while (listOfFrontierNodes.length !== 0) {
    var randomFrontierIdx = getRandomInt(0, listOfFrontierNodes.length - 1);
    var randomFrontierNode = listOfFrontierNodes[randomFrontierIdx]; //random fr
    randomFrontierNode.isVisited = true;
    var neighbours = [];
    getNeighbourNodes(
      grid,
      neighbours,
      randomFrontierNode.row,
      randomFrontierNode.col,
      numRows,
      numCols
    );
    var randomNeighbourIdx = getRandomInt(0, neighbours.length - 1);
    var randomNeighbour = neighbours[randomNeighbourIdx];
    if (neighbours.length !== 0) {
      if (randomNeighbour.col === randomFrontierNode.col) {
        if (randomNeighbour.row - randomFrontierNode.row > 0) {
          //neighbour is below frontier node
          grid[randomFrontierNode.row + 1][
            randomFrontierNode.col
          ].isWall = false;
          //        grid[randomFrontierNode.row + 1][randomFrontierNode.col].isVisited = true;
          animations.push(
            grid[randomFrontierNode.row + 1][randomFrontierNode.col]
          );
        } else {
          //neighbour is above
          grid[randomFrontierNode.row - 1][
            randomFrontierNode.col
          ].isWall = false;
          //        grid[randomFrontierNode.row - 1][randomFrontierNode.col].isVisited = true;
          animations.push(
            grid[randomFrontierNode.row - 1][randomFrontierNode.col]
          );
        }
      } else {
        if (randomNeighbour.col - randomFrontierNode.col > 0) {
          //neighbour is right
          grid[randomFrontierNode.row][
            randomFrontierNode.col + 1
          ].isWall = false;
          //        grid[randomFrontierNode.row][randomFrontierNode.col + 1].isVisited = true;
          animations.push(
            grid[randomFrontierNode.row][randomFrontierNode.col + 1]
          );
        } else {
          //neighbour is left
          grid[randomFrontierNode.row][
            randomFrontierNode.col - 1
          ].isWall = false;
          //        grid[randomFrontierNode.row][randomFrontierNode.col - 1].isVisited = true;
          animations.push(
            grid[randomFrontierNode.row][randomFrontierNode.col - 1]
          );
        }
      }
    }
    getFrontierNodes(
      grid,
      listOfFrontierNodes,
      randomFrontierNode.row,
      randomFrontierNode.col,
      numRows,
      numCols
    );
    //        listOfFrontierNodes.splice(randomFrontierIdx, 1);
    // listOfFrontierNodes = listOfFrontierNodes.filter(
    //   node =>
    //     node.col !== randomFrontierNode.col &&
    //     node.row !== randomFrontierNode.row
    // );
    //        console.log(listOfFrontierNodes);
  }

  return animations;
}

function getFrontierNodes(grid, list, row, col, numRows, numCols) {
  if (
    row - 2 >= 0 &&
    grid[row - 2][col].isWall &&
    !grid[row - 2][col].isVisited
  ) {
    //up node is within bounds and is a wall
    list.push(grid[row - 2][col]);
    //    grid[row - 2][col].isVisited = true;
  }
  if (
    row + 2 < numRows &&
    grid[row + 2][col].isWall &&
    !grid[row + 2][col].isVisited
  ) {
    //bottom node is ...
    list.push(grid[row + 2][col]);
    //    grid[row + 2][col].isVisited = true;
  }
  if (
    col - 2 >= 0 &&
    grid[row][col - 2].isWall &&
    !grid[row][col - 2].isVisited
  ) {
    //left node is ...
    list.push(grid[row][col - 2]);
    //    grid[row][col - 2].isVisited = true;
  }
  if (
    col + 2 < numCols &&
    grid[row][col + 2].isWall &&
    !grid[row][col + 2].isVisited
  ) {
    //right node is ...
    list.push(grid[row][col + 2]);
    //    grid[row][col + 2].isVisited = true;
  }
}

function getNeighbourNodes(grid, list, row, col, numRows, numCols) {
  if (
    row - 2 >= 0 &&
    !grid[row - 2][col].isWall &&
    !grid[row - 2][col].isVisited
  ) {
    //up node is within bounds and is a wall
    list.push(grid[row - 2][col]);
  }
  if (
    row + 2 < numRows &&
    !grid[row + 2][col].isWall &&
    !grid[row + 2][col].isVisited
  ) {
    //bottom node is ...
    list.push(grid[row + 2][col]);
  }
  if (
    col - 2 >= 0 &&
    !grid[row][col - 2].isWall &&
    !grid[row][col - 2].isVisited
  ) {
    //left node is ...
    list.push(grid[row][col - 2]);
  }
  if (
    col + 2 < numCols &&
    !grid[row][col + 2].isWall &&
    !grid[row][col + 2].isVisited
  ) {
    //right node is ...
    list.push(grid[row][col + 2]);
  }
}

//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (inclusive) and max (inclusive).
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
