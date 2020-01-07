import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import {
  dijkstra,
  getNodesInShortestPathOrder,
  getNodesInShortestPathOrderBiDirectional
} from "../Algorithms/Dijkstra";
import { BFS } from "../Algorithms/BFS";
import { DFS } from "../Algorithms/DFS";
import { IDDFS } from "../Algorithms/IDDFS";
import { Astar } from "../Algorithms/Astar";
import {
  biDirectional,
  INTERSECT_NODE_COL,
  INTERSECT_NODE_ROW
} from "../Algorithms/BiDirectional";
import { greedyBestFS } from "../Algorithms/GreedyBestFS";
import { primm } from "../Mazes/Primm";
import { simpleMaze } from "../Mazes/SimpleMaze";
import { generateMazeAnimations } from "../Algorithms/GenerateMaze";
import { recursiveDivision } from "../Mazes/RecursiveDivision";

import "../Components/Button.css";
import "../Components/Modal.css";
import { displayAlgorithmInfo } from "../Algorithms/AlgorithmInfo";
import "../Components/AlgorithmModal.css";

export const NUM_COLUMNS = 42;
export const NUM_ROWS = 20;
var START_NODE_ROW = 4;
var START_NODE_COL = 2;
var FINISH_NODE_ROW = 13;
var FINISH_NODE_COL = 35;
var mouseIsPressed = false;
var startIsPressed = false;
var finishIsPressed = false;
var isRunning = false;
var slideNumber = 0;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    };
  }

  componentDidMount() {
    const grid = getInitalGrid();
    this.setState({ grid });
    window.onload = this.displayNote();
  }

  //document.getElementById changes the HTML image
  handleMouseDown(row, col) {
    if (isRunning) return;

    const grid = this.state.grid;
    mouseIsPressed = true;

    var node = grid[row][col];

    if (node.isStart) {
      startIsPressed = true;
      return;
    }
    if (node.isFinish) {
      finishIsPressed = true;
      return;
    }
    node.isWall = !node.isWall;
    if (node.isWall && !node.isStart && !node.isFinish) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-wall";
    } else if (!node.isStart && !node.isFinish) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    }

    //this.setState({ grid: grid });
  }

  // what happens here is that we don't set state, so the state isn't updated correclty
  // not until we use a method that changes the state such as clear or visualize, which then
  // automatically calls render. However, this still works because the id and fields of the nodes
  // are changed, we just don't see the reflected change in the state yet.
  // although we sacrafice a correctly updated state, we can now update walls faster
  handleMouseEnter(row, col) {
    if (!mouseIsPressed || isRunning) return;

    var div = document.getElementById("grid");
    div.onmouseleave = function() {
      console.log("mouse exited");
      startIsPressed = false;
      finishIsPressed = false;
      mouseIsPressed = false;
    };

    const grid = this.state.grid;
    //grid[row][col].isWall = !grid[row][col].isWall;
    //this.setState({ grid: grid });

    var node = grid[row][col];

    if (startIsPressed) {
      if (node.isFinish || node.isWall) return;
      //if (row === START_NODE_ROW && col === START_NODE_COL) return;

      var startNode = grid[START_NODE_ROW][START_NODE_COL];
      START_NODE_ROW = row;
      START_NODE_COL = col;
      document.getElementById(
        `node-${startNode.row}-${startNode.col}`
      ).className = "node";
      
      startNode.isStart = false;
      startNode.isWall = false;
      node.isStart = true;
      node.isWall = false;
      
      document.getElementById(`node-${row}-${col}`).className =
        "node node-start";
      return;
    } else if (finishIsPressed) {
      if (node.isStart || node.isWall) return;

      var finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      document.getElementById(
        `node-${finishNode.row}-${finishNode.col}`
      ).className = "node";
      finishNode.isFinish = false;
      finishNode.isWall = false;
      node.isFinish = true;
      node.isWall = false;
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-finish";
      return;
    }

    if (node.isStart || node.isFinish) return;

    node.isWall = !node.isWall;
    if (node.isWall && !node.isStart && !node.isFinish) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-wall";
    } else if (!node.isStart && !node.isFinish) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    }
  }

  handleMouseUp() {
    if (isRunning) return;
    startIsPressed = false;
    finishIsPressed = false;
    mouseIsPressed = false;
    isRunning = false;
  }

  //document: is the HTML file with all the elements
  // setTimeout: executes the function after waiting a number of milliseconds
  animateAlgorithm(
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    isBiDirectional
  ) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (isBiDirectional) {
          if (nodesInShortestPathOrder.length <= 2) {
            if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited-invalid-start";
            } else if (
              node.row === FINISH_NODE_ROW &&
              node.col === FINISH_NODE_COL
            ) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited-invalid-finish";
            } else {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited-invalid";
            }
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
          }
        } else {
          if (nodesInShortestPathOrder.length <= 1) {
            if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited-invalid-start";
            } else {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-visited-invalid";
            }
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
          }
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    // document.getElementById(
    //   `node-${START_NODE_ROW}-${START_NODE_COL}`
    // ).className = "node node-visited-start";
    console.log(isRunning);

    console.log(nodesInShortestPathOrder);
    if (
      nodesInShortestPathOrder == null ||
      nodesInShortestPathOrder.length <= 1
    ) {
      document.getElementById(
        `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
      ).className = "node node-visited-invalid-finish";
      isRunning = false;
      return;
    }
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      //      console.log(isRunning);
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (typeof node === "undefined") {
          isRunning = false;
          return;
        }
        if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited-finish";
        } else if (node.isStart) {
          document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
          ).className = "node node-visited-start";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          isRunning = false;
        }
      }, 50 * i);
    }
  }

  visualizeAlgorithm(algo) {
    this.clearGridKeepWalls(this.state.grid);
    if (isRunning) return;
    isRunning = true;
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    var nodesInShortestPathOrder;

    var visitedNodesInOrder = null;
    switch (algo) {
      case 0: {
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      }
      case 1: {
        visitedNodesInOrder = BFS(grid, startNode, finishNode);
        break;
      }
      case 2: {
        visitedNodesInOrder = DFS(grid, startNode, finishNode);
        break;
      }
      case 3: {
        visitedNodesInOrder = IDDFS(grid, startNode, finishNode);
        break;
      }
      case 4: {
        visitedNodesInOrder = Astar(grid, startNode, finishNode);
        break;
      }
      case 5: {
        visitedNodesInOrder = greedyBestFS(grid, startNode, finishNode);
        break;
      }
      case 6: {
        visitedNodesInOrder = biDirectional(grid, startNode, finishNode);
        nodesInShortestPathOrder = this.biDirectionalHelper(
          grid,
          visitedNodesInOrder
        );
        break;
      }
      default:
        visitedNodesInOrder = BFS(grid, startNode, finishNode);
        break;
    }

    if (algo !== 6)
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    if (visitedNodesInOrder !== false) {
      console.log(grid);
      if (algo === 6) {
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 1);
      } else {
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 0);
      }
    }
  }

  biDirectionalHelper(grid, visitedNodesInOrder) {
    var nodesInShortestPathOrder = [];
    if (
      typeof INTERSECT_NODE_COL !== "undefined" &&
      typeof INTERSECT_NODE_ROW !== "undefined" &&
      INTERSECT_NODE_ROW !== -1 &&
      INTERSECT_NODE_COL !== -1
    ) {
      const intersectNode = grid[INTERSECT_NODE_ROW][INTERSECT_NODE_COL];
      //get first branch from intersection Node
      const nodesInShortestPathOrder1 = getNodesInShortestPathOrder(
        intersectNode
      );
      //find second branch from one of 4 nodes beside intersection node
      const nodesInShortestPathOrder2 = this.findSecondBranch(
        grid,
        nodesInShortestPathOrder1,
        visitedNodesInOrder
      );
      //combine first and second branch to form shortest path
      const nodesInShortestPathOrderCombined = nodesInShortestPathOrder1.concat(
        nodesInShortestPathOrder2
      );
      //console.log(nodesInShortestPathOrder);
      nodesInShortestPathOrder = nodesInShortestPathOrderCombined;
    }
    return nodesInShortestPathOrder;
  }

  findSecondBranch(grid, firstBranch, visitedNodesInOrder) {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let rightBesideIntersectNode = null;
    let rightWithinBounds = true;
    if (INTERSECT_NODE_COL + 1 >= NUM_COLUMNS) rightWithinBounds = false;
    else
      rightBesideIntersectNode =
        grid[INTERSECT_NODE_ROW][INTERSECT_NODE_COL + 1];

    let belowBesideIntersectNode = null;
    let belowWithinBounds = true;
    if (INTERSECT_NODE_ROW + 1 >= NUM_ROWS) belowWithinBounds = false;
    else
      belowBesideIntersectNode =
        grid[INTERSECT_NODE_ROW + 1][INTERSECT_NODE_COL];

    let leftBesideIntersectNode = null;
    let leftWithinBounds = true;
    if (INTERSECT_NODE_COL - 1 < 0) leftWithinBounds = false;
    else
      leftBesideIntersectNode =
        grid[INTERSECT_NODE_ROW][INTERSECT_NODE_COL - 1];

    let aboveBesideIntersectNode = null;
    let aboveWithinBounds = true;
    if (INTERSECT_NODE_ROW - 1 < 0) aboveWithinBounds = false;
    else
      aboveBesideIntersectNode =
        grid[INTERSECT_NODE_ROW - 1][INTERSECT_NODE_COL];

    let nodesInShortestPathOrderTestRight = [];

    if (rightWithinBounds) {
      nodesInShortestPathOrderTestRight = getNodesInShortestPathOrderBiDirectional(
        rightBesideIntersectNode,
        visitedNodesInOrder
      );
    }
    let nodesInShortestPathOrderTestBelow = [];
    if (belowWithinBounds) {
      nodesInShortestPathOrderTestBelow = getNodesInShortestPathOrderBiDirectional(
        belowBesideIntersectNode,
        visitedNodesInOrder
      );
    }
    let nodesInShortestPathOrderTestLeft = [];
    if (leftWithinBounds) {
      nodesInShortestPathOrderTestLeft = getNodesInShortestPathOrderBiDirectional(
        leftBesideIntersectNode,
        visitedNodesInOrder
      );
    }
    let nodesInShortestPathOrderTestAbove = [];
    if (aboveWithinBounds) {
      nodesInShortestPathOrderTestAbove = getNodesInShortestPathOrderBiDirectional(
        aboveBesideIntersectNode,
        visitedNodesInOrder
      );
    }

    if (this.arrayContainsGivenNode(firstBranch, startNode)) {
      //first branch leads to startNode
      //we check all test branches, to see if they lead to finish Node. if they do, return it
      if (
        rightWithinBounds &&
        this.arrayContainsGivenNode(
          nodesInShortestPathOrderTestRight,
          finishNode
        )
      )
        return nodesInShortestPathOrderTestRight;

      if (
        belowWithinBounds &&
        this.arrayContainsGivenNode(
          nodesInShortestPathOrderTestBelow,
          finishNode
        )
      )
        return nodesInShortestPathOrderTestBelow;

      if (
        leftWithinBounds &&
        this.arrayContainsGivenNode(
          nodesInShortestPathOrderTestLeft,
          finishNode
        )
      )
        return nodesInShortestPathOrderTestLeft;

      if (
        aboveWithinBounds &&
        this.arrayContainsGivenNode(
          nodesInShortestPathOrderTestAbove,
          finishNode
        )
      )
        return nodesInShortestPathOrderTestAbove;
    } else {
      //first branch leads to finishNode
      // we check all test branches, to see if they lead to start node. if they do, return it
      if (
        this.arrayContainsGivenNode(
          rightWithinBounds && nodesInShortestPathOrderTestRight,
          startNode
        )
      )
        return nodesInShortestPathOrderTestRight;

      if (
        this.arrayContainsGivenNode(
          belowWithinBounds && nodesInShortestPathOrderTestBelow,
          startNode
        )
      )
        return nodesInShortestPathOrderTestBelow;

      if (
        leftWithinBounds &&
        this.arrayContainsGivenNode(nodesInShortestPathOrderTestLeft, startNode)
      )
        return nodesInShortestPathOrderTestLeft;

      if (
        aboveWithinBounds &&
        this.arrayContainsGivenNode(
          nodesInShortestPathOrderTestAbove,
          startNode
        )
      )
        return nodesInShortestPathOrderTestAbove;
    }
  }
  /*
      //we check each path to see if it both DOES NOT contain the first branch and leads to the Start or Finish Node
      //if both condition holds, we have found second branch and we return it.
      if (!this.arrayContainsGivenNode(firstBranch, rightBesideIntersectNode) && this.arrayContainsStartOrFinishNode(nodesInShortestPathOrderTestRight)) {
        return nodesInShortestPathOrderTestRight;
      }
      if (!this.arrayContainsGivenNode(firstBranch, belowBesideIntersectNode) && this.arrayContainsStartOrFinishNode(nodesInShortestPathOrderTestBelow)) {
        return nodesInShortestPathOrderTestBelow;
      }
      if (!this.arrayContainsGivenNode(firstBranch, leftBesideIntersectNode) && this.arrayContainsStartOrFinishNode(nodesInShortestPathOrderTestLeft)) {
        return nodesInShortestPathOrderTestLeft;
      }
      if (!this.arrayContainsGivenNode(firstBranch, aboveBesideIntersectNode) && this.arrayContainsStartOrFinishNode(nodesInShortestPathOrderTestAbove)) {
        return nodesInShortestPathOrderTestAbove;
      }
  
    }
  */
  arrayContainsGivenNode(array, node) {
    if (array === []) return false;
    for (let element of array) {
      if (element.row === node.row && element.col === node.col) {
        return true;
      }
    }
    return false;
  }
  /*
    arrayContainsStartOrFinishNode(array) {
      for (const node of array) {
        if ((node.row == START_NODE_ROW && node.col == START_NODE_COL) || (node.row == FINISH_NODE_ROW && node.col == FINISH_NODE_COL)) {
          return true
        }
      }
      return false;
  
  
    }
  */

  visualizeWalls(maze) {
    this.clearGrid();
    if (isRunning) return;
    isRunning = true;
    //const { grid } = this.state;
    const grid = clearGridHelper();
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    var nodesToBeWalls = null;
    switch (maze) {
      case 0: {
        // nodesToBeWalls = primm(grid, startNode, finishNode);
        // mazeWalls = getNodesInShortestPathOrder(finishNode);
        //console.log(grid);

        nodesToBeWalls = simpleMaze(grid, startNode, finishNode);
        break;
      }

      case 1: {
        console.log(grid);

        nodesToBeWalls = recursiveDivision(
          grid,
          1,
          NUM_ROWS - 2,
          1,
          NUM_COLUMNS - 2,
          "HORIZONTAL",
          "regularMaze"
        );
        console.log(grid);
        break;
      }

      case 2: {
        nodesToBeWalls = recursiveDivision(
          grid,
          1,
          NUM_ROWS - 2,
          1,
          NUM_COLUMNS - 2,
          "VERTICAL",
          "verticalMaze"
        );
        break;
      }

      case 3: {
        nodesToBeWalls = recursiveDivision(
          grid,
          1,
          NUM_ROWS - 2,
          1,
          NUM_COLUMNS - 2,
          "HORIZONTAL",
          "horizontalMaze"
        );
        break;
      }
      default: {
        isRunning = false;
        break;
      }
    }

    if (nodesToBeWalls !== null) {
      this.animateWalls(nodesToBeWalls, grid);
    }
  }

  animateWalls(nodesToBeWalls, grid) {
    for (let i = 0; i <= nodesToBeWalls.length; i++) {
      setTimeout(() => {
        const node = nodesToBeWalls[i];
        if (typeof node !== "undefined") {
          if (!node.isStart && !node.isFinish && node.isWall) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-wall";
          }
        }

        if (i === nodesToBeWalls.length - 1) {
          isRunning = false;
          this.setState({ grid: grid });
        }
      }, 10 * i);
    }
  }

  clearGrid() {
    if (isRunning) return;
    const newgrid = clearGridHelper();
    this.setState({ grid: newgrid });
    return newgrid;
  }

  clearGridKeepWalls(grid) {
    if (isRunning) return;
    const newgrid = clearGridHelperKeepWalls(grid);
    this.setState({ grid: newgrid });
  }

  refreshPage() {
    window.location.reload();
  }

  openHelpMenu() {
    //make new jsx and css page for the helper menu
    // make sure background is not interactable when help menu is open
    // add X button to close
    // describe algorithms, link github repo site, add tutorial how to work, add motivation why we made the application
    // Get the modal
    var modal = document.getElementById("helpMenu");
    modal.style.display = "block";

    // Get the button that opens the modal
    var btn = document.getElementById("info-button");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    console.log(modal, btn, span);

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    this.changeText(0);
  }

  changeText(next) {
    const MAXSLIDE = 5;
    const MINSLIDE = 1;

    if (next === 1) {
      if (slideNumber === MAXSLIDE) {
        slideNumber = MAXSLIDE;
      } else {
        slideNumber += next;
      }
    } else if(next===-1){
      if (slideNumber === MINSLIDE) {
        slideNumber = MINSLIDE;
      } else {
        slideNumber += next;
      }
    } else {
      slideNumber = MINSLIDE;
    }
    switch (slideNumber) {
      case 1: {
        document.getElementById("helpMenu-content").innerHTML =
          this.HTMLHelper(MAXSLIDE) +
          `
        <h2 style= "margin-top: -0.3em;"> Welcome to our Pathfinding Visualizer </h2> 
        <h3 style= "margin-top: -0.7em;"> Made by Ryan L. and Eric K.</h3>
        <p> Our pathfinding application simulates multiple pathfinding algorithms. Pathfinding algorithms 
        attempt to compute the shortest path from one point to another. Pathfinding is a fundamental component used in the world every day, from using
         Google maps to find the shortest route, to directing autonomous robots to minimize the amount of turning, braking or specific application requirements. Our application
         simulates a maze with walls. </p>
        <p> Click on <strong>Next</strong> to continue the tutorial. Otherwise click anywhere outside the box, or the <strong>X</strong> button to play around with our application</p>
        <p><img style="display: block; margin-left: auto; margin-right: auto; margin-top: -2.8em;" src="https://i.ibb.co/P9fVVW8/slide0-png.png" alt="" width="225" height="235" /></p>`;
        break;
      }

      case 2: {
        document.getElementById("helpMenu-content").innerHTML =
          this.HTMLHelper(MAXSLIDE) +
          `<h2 style= "margin-top: -0.3em;">Motivation</h2>
        <p> We wanted to make this application because after taking a beginner's algorithms and data structures course, both of 
        us were amazed by the idea of pathfinding. We created this app to help others understand how certain algorithms 
        explore and compute the shortest path using visual animations. We also hope this application motivates others
        to explore other algorithms we have not covered and to research more about the applications and possibilities of
        pathfinding in the real world!</p>
        <p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://image.flaticon.com/icons/png/512/584/584641.png" alt="" width="129" height="129" /></p>`;
        break;
      }

      case 3: {
        document.getElementById("helpMenu-content").innerHTML =
          this.HTMLHelper(MAXSLIDE) +
          `<h2 style= "margin-top: -0.3em;"> How to Use </h2>
        <p style = "line-height: 1.15em;"> Click and drag anywhere on the grid to draw some walls. You can also 
        drag and move the start and end nodes to your desired location. On the left side, select the algorithm
        you want to visualize. If there is no path from the start node to the end node, the path will be <span style = "color: red;"> <strong>red</strong></span>. Otherwise, the path will be <span style = "color: yellow;"> <strong>yellow</strong></span> and the area explored by the algorithm
        will be <span style = "color: green;"> <strong>green</strong></span>. Press <strong>Clear Board</strong> if you want to start from scratch, or <Strong>Clear Path</strong> if you want to visualize another algorithm with the same walls.
        We also made templates of mazes at the top of our application. Finally, click on the <strong>?</strong> button to view this tutorial again.</p>

        <table style="height: 108px; width: 190; margin-left: auto; margin-right: auto;">
        <tbody>
        <tr style="height: 33.8px;">
        <td style="width: 65px; height: 33.8px; text-align: center;"><img src="https://icons-for-free.com/iconfiles/png/512/double+arrow+doublechevronright+right+arrows+icon-1320185729292506033.png" alt="" width="27" height="27" /></td>
        <td style="width: 116px; height: 33.8px; text-align: left;">= startNode</td>
        </tr>
        <tr style="height: 17px;">
        <td style="width: 65px; height: 17px; text-align: center;"><img src="https://i.pinimg.com/originals/ba/3f/f2/ba3ff2209d0c43655116b31f8e2bbd65.png" alt="" width="27" height="27" /></td>
        <td style="width: 116px; height: 17px; text-align: left;">= finishNode</td>
        </tr>
        </tbody>
        </table>
        <p>&nbsp;</p>
        `;
        break;
      }

      case 4: {
        document.getElementById("helpMenu-content").innerHTML =
          this.HTMLHelper(MAXSLIDE) +
          `<h2 style= "margin-top: -0.3em;"> Algorithm Information </h2>
          <table>
          <tbody>
          <tr>
          <td><img src="https://i.imgur.com/fnhxgNj.jpg" alt="" width="59" height="60" /></td>
          <td>
          <p style="text-align: left; padding-left: 10px">Click on this icon beside any pathfinding algorithm to view details about&nbsp;how to use the algorithm, the time complexity, and detailed commented code about how the algorithm works. Feel free to go to our Github repository on the next page to see more implementation details</p>
          </td>
          </tr>
          </tbody>
          </table>
        `;
        break;
      }

      case 5: {
        document.getElementById("helpMenu-content").innerHTML =
          this.HTMLHelper(MAXSLIDE) +
          `<h2 style= "margin-top: -0.3em;"> Last Words </h2>
          <p> We hope you have fun with this application. Please feel free to contact any of us for feedback on the application. You
          can also check out our Github source code at <a href = "https://github.com/ericrkuo/Pathfinding" target="_blank">Pathfinding Visualizer</a> </p>          
          <p>*Note: if your screen is small and the proportions of the maze seem wrong, use CTRL – to zoom out</p>
          <table style="height: 227px; margin-left: auto; margin-right: auto; width: 552px;">
          <tbody>
          <tr>
          <td style="width: 157px;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.ibb.co/V9qg42q/Eric-Kuo-UBC-Card.jpg" alt="" width="110" height="147" /></td>
          <td style="width: 199px;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://image.flaticon.com/icons/png/512/87/87090.png" alt="" width="152" height="152" /></td>
          <td style="width: 179px;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.ibb.co/jgZ7fF9/81928054-601968013933600-5665482190398423040-n.jpg" alt="" width="130" height="147" /></td>
          </tr>
          <tr>
          <td style="width: 157px; text-align: center;"><a href="https://www.linkedin.com/in/eric-k-1198b6192/" target = "_blank">LinkedIn Eric Kuo</a></td>
          <td style="width: 199px; text-align: center;">&nbsp;</td>
          <td style="width: 179px; text-align: center;"><a href="https://www.linkedin.com/in/ryan-liu18/" target = "_blank">LinkedIn Ryan Liu</a></td>
          </tr>
          </tbody>
          </table>
        `;
        break;
      }

      default:
        break;
    }

    var prevBtn = document.getElementById("Prev");
    var nextBtn = document.getElementById("Next");
    if (slideNumber === MINSLIDE) {
      prevBtn.style.backgroundColor = "lightgrey";
      prevBtn.disabled = true;
      nextBtn.disabled = false;
      nextBtn.style.backgroundColor = "hsl(214, 100%, 70%)";
    } else if (slideNumber === MAXSLIDE) {
      nextBtn.disabled = true;
      nextBtn.style.backgroundColor = "lightgrey";
      prevBtn.disabled = false;
      prevBtn.style.backgroundColor = "hsl(214, 100%, 70%)";
    } else {
      console.log("reached here");
      prevBtn.disabled = false;
      prevBtn.style.backgroundColor = "hsl(214, 100%, 70%)";
      nextBtn.disabled = false;
      nextBtn.style.backgroundColor = "hsl(214, 100%, 70%)";
    }
  }

  HTMLHelper(MAXSLIDE) {
    return (
      `<p> ` +
      slideNumber +
      `/` +
      MAXSLIDE +
      `<p>
  `
    );
  }

  openAlgoMenu(info) {
    var modal = document.getElementById("algo-modal");
    modal.style.display = "block";

    var modalContent = document.getElementById("algo-modal-content");
    modalContent.scrollTop = 0;

    // // Get the button that opens the modal
    // var btn = document.getElementById("info-button");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("algo-close")[0];

    //console.log(modal, btn, span);

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
    document.getElementById(
      "algo-modal-content"
    ).innerHTML = displayAlgorithmInfo(info);
  }

  generateMaze() {
    if (isRunning) return;
    isRunning = true;
    const { grid } = this.state;
    const animations = generateMazeAnimations(grid, NUM_ROWS, NUM_COLUMNS);

    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLUMNS; j++) {
        //       setTimeout(() => {
        const node = grid[i][j];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall";
        //        }, i * 10);
      }
    }

    console.log(animations.length);
    for (let i = 0; i < animations.length; i++) {
      setTimeout(() => {
        const node = animations[i];
        if (i === 0) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (i === animations.length - 1) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
          isRunning = false;
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
          console.log(node);
        }
      }, 10 * i + 20);
    }
  }

  displayNote(){
    var modal = document.getElementById("note-modal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("note-close")[0];

    //console.log(modal, btn, span);

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  render() {
    const { grid } = this.state;
    //console.log(grid);

    // goes through each grid element and visually creates a Node
    //<Button buttonStyle="btn--primary--solid" buttonSize="btn--medium">Test</Button>

    return (
      <>
        <div className="title-container">
          <div className="title" onClick={() => this.refreshPage()}>
            Pathfinding Visualizer
          </div>

          <div className="title-button-row">
            <button onClick={() => this.visualizeWalls(1)}>
              {" "}
              Recursive Division{" "}
            </button>
            <button onClick={() => this.visualizeWalls(0)}> Scatter </button>
            <button onClick={() => this.visualizeWalls(2)}>
              {" "}
              Vertical Maze{" "}
            </button>
            <button onClick={() => this.visualizeWalls(3)}>
              {" "}
              Horizontal Maze{" "}
            </button>
            {/* <button onClick={() => this.generateMaze()}> Generate Maze</button> */}
          </div>
          <button
            id="info-button"
            className="info-button"
            onClick={() => this.openHelpMenu()}
          >
            {" "}
            ?{" "}
          </button>
        </div>

        <div id="helpMenu" className="modal">
          <div className="modal-container">
            <span id="close" className="close">
              &times;
            </span>
            <div className="buttons-container">
              <div className="info-buttons">
                <button id="Prev" onClick={() => this.changeText(-1)}>
                  {" "}
                  Prev{" "}
                </button>
                <button id="Next" onClick={() => this.changeText(1)}>
                  {" "}
                  Next{" "}
                </button>
              </div>
            </div>
          </div>
          <div id="helpMenu-content" className="modal-content"></div>
        </div>

        <div id="algo-modal" className="algo-modal">
          <span id="algo-close" className="algo-close">
            &times;
          </span>
          <div id="algo-modal-content" className="algo-modal-content"></div>
        </div>

        <div id = "note-modal"className = "modal">
          <div id="note-modal-content" className = "note-modal-content">
              NOTE: Use CTRL + MINUS (-) if the grid is too large for your screen.
              <p style = {{fontSize: "12px", marginTop: "-0.1em"}}> (Click anywhere outside the box or the X to close)</p>
          </div>
          <span id="note-close" className="note-close">
            &times;
          </span>
        </div>
        

        <div className="container">
          <div className="algo-btn-group">
            <button onClick={() => this.openAlgoMenu(0)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(1)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(2)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(3)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(4)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(5)}> &#9432; </button>
            <button onClick={() => this.openAlgoMenu(6)}> &#9432; </button>
          </div>
          <div className="btn-group">
            <button onClick={() => this.visualizeAlgorithm(0)}>
              Dijkstra's Algorithm
            </button>
            <button onClick={() => this.visualizeAlgorithm(1)}>
              Breadth First Search
            </button>
            <button onClick={() => this.visualizeAlgorithm(2)}>
              Depth First Search
            </button>
            <button onClick={() => this.visualizeAlgorithm(3)}>
              Iterative Deepening DFS
            </button>
            <button onClick={() => this.visualizeAlgorithm(4)}>A*</button>
            <button onClick={() => this.visualizeAlgorithm(5)}>
              Greedy Best First Search
            </button>

            <button onClick={() => this.visualizeAlgorithm(6)}>
              BiDirectional BFS
            </button>

            <button onClick={() => this.clearGridKeepWalls(grid)}>
              Clear Path
            </button>
            <button id="clearGrid" onClick={() => this.clearGrid()}>
              Clear Board
            </button>
          </div>

          <div className="grid" id="grid">
            {grid.map((row, rowIdx) => {
              //go through each row in the grid
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    // for each node in each row, add styling
                    const { col, row, isStart, isFinish, isWall } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        isStart={isStart}
                        isFinish={isFinish}
                        col={col}
                        row={row}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

function createNode(col, row) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    //    visitedByStart: false,
    //    visitedByFinish: false,
    distance: Infinity,
    visited: false,
    isWall: false,
    previousNode: null
  };
}

function getInitalGrid() {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < NUM_COLUMNS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
}

function clearGridHelper() {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < NUM_COLUMNS; col++) {
      var node = createNode(col, row);
      node.isWall = false;

      if (!node.isFinish && !node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
      } else if (node.isFinish) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-finish";
      } else if (node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-start";
      }

      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
}

function clearGridHelperKeepWalls(ogGrid) {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < NUM_COLUMNS; col++) {
      var node = createNode(col, row);
      //      const {ogGrid} = this.state;
      if (ogGrid[row][col].isWall) node.isWall = true;
      //console.log(node);

      if (node.isWall) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall";
      } else if (!node.isFinish && !node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
      } else if (node.isFinish) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-finish";
      } else if (node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-start";
      }

      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
}

// function getNewGridWithWallToggled(grid, row, col) {
//   //   const newGrid = grid.slice();
//   //   const node = newGrid[row][col];
//   //   const newNode = {
//   //     ...node,
//   //     isWall: !node.isWall
//   //   };
//   //   newGrid[row][col] = newNode;
//   //   return newGrid;

//   grid[row][col].isWall = !grid[row][col].isWall;
//   return grid;
// }
