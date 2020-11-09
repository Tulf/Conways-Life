import React from 'react';
import { CELL_SIZE } from './constants';

export default ({ x, y }) => {
      let randomColor = Math.floor(100000 + Math.random()*16777215).toString(16);
      //offseting by x and y for left and top, everything relative to the left and top of grid
      return (
        <div className="Cell" style={{
          left: `${CELL_SIZE * x + 1}px`,
          top: `${CELL_SIZE * y + 1}px`,
          width: `${CELL_SIZE - 1}px`,
          height: `${CELL_SIZE - 1}px`,
          background: `#${randomColor}`,
        }} />
      );
  }