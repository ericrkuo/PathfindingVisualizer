import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp
    } = this.props;

    var extraClassName = "";
    if (isFinish) {
      extraClassName = "node-finish";
    } else if (isStart) {
      extraClassName = "node-start";
    } else if (isWall) {
      extraClassName = "node-wall";
    }

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0
};
