import React, { Component } from "react";
import "./Node.css";
import PropTypes from "prop-types";

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
            className={`node ${extraClassName}`}
            id={`node-${row}-${col}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
        />
    );
  }
}

Node.propTypes = {
  col: PropTypes.number,
  row: PropTypes.number,
  isFinish: PropTypes.bool,
  isStart: PropTypes.bool,
  isWall: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseUp: PropTypes.func
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0
};
