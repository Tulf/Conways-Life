import React, { useState, useRef } from 'react';

import Cell from './cell';
import { 
  CELL_SIZE, 
  NUM_COLUMNS,
  NUM_ROWS,
  PX_WIDTH,
  PX_HEIGHT 
} from './constants'

import '../styles/Game.css';

export default () => {
  //method to create an empty board:
  const makeEmptyBoard = () => {
    let initBoard = [];
    for(let y = 0; y < NUM_ROWS; y++){
      //make y axis of arrays
      initBoard[y] = [];
      for (let x = 0; x < NUM_COLUMNS; x++){
        // so we have a "2D" array with an array of arrays for entries.
        initBoard[y][x] = false;
      }
    }
    //return an empty board, with all false values for now.
    return initBoard;
  }

  const [cells, setCells] = useState([]);
  const [interval, setInterval] = useState(70);
  const [isRunning, setIsRunning] = useState(false);
  const [gen, setGen] = useState(0);
  const [board, setBoard] = useState(makeEmptyBoard());
  let boardRef = useRef(null);
  let intervalVar;
  
  //Create cells from board:
  const makeCells = () => {
    let innerCells = [];
    for (let y = 0; y < NUM_ROWS; y++){
      for (let x = 0; x < NUM_COLUMNS; x++){
        if(board[y][x]){
          innerCells.push({ x, y });
        }
      }
    }
    return innerCells;
  }
  //getElementOffset calculates the  position of a board element (obv will be mappped on the whole array eventually)
  //getBoundingClientRect return the size of an element and its position relative to the viewport
  //The returned value is a DOMRect object which is the union of the rectangles returned by getClientRects() for the element, i.e., the CSS border-boxes associated with the element. The result is the smallest rectangle which contains the entire element, with read-only left, top, right, bottom, x, y, width, and height properties describing the overall border-box in pixels. Properties other than width and height are relative to the top-left of the viewport.
  // since we are in a grid we can use this with some simple calculations.
  // this basically will let us match the board click with the 
  const getElementOffset = () => {
    const rect = boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    console.log(rect);
    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  //listener function for increase in board size:
  const handleResize = (expand) => {
    if(expand.row){
      //augment NUM_ROWS++
    }
    if(expand.column){
      //augment NUM_COLUMNS++
    }

    //call in render
  }

  const handleClick = (event) => {
    if(isRunning === false){
      const elemOffset = getElementOffset();
      //client returns horz/vert mouse position
      //offset gives coordinates relative to css bound
      const offsetX = event.clientX - elemOffset.x;
      const offsetY = event.clientY - elemOffset.y;

      const x = Math.floor(offsetX / CELL_SIZE);
      const y = Math.floor(offsetY / CELL_SIZE);

      if(x>= 0 && x <= NUM_COLUMNS && y>= 0 && y<= NUM_ROWS){
        board[y][x] = !board[y][x];
      }

      setCells(() => makeCells());
    }
  }

  //helper functions to run the game:
  //toggle runnning on/off
  const runGame = () => {
    setIsRunning(true)
    intervalVar = window.setInterval(() => runIteration(), interval)
  }

  const stopGame = () => {
    setIsRunning(false);
    clearInterval(intervalVar);
  }

  const runIteration = () => {
    //double buffering
    let newBoard = makeEmptyBoard();
    console.log(gen)
    //logic for each iteration:
      for (let y = 0; y < NUM_ROWS; y++) {
          for (let x = 0; x < NUM_COLUMNS; x++) {
              let neighbors = calculateNeighbors(board, x, y);
              //cehck neighbors from old array.
              if (board[y][x]) {
                  if (neighbors === 2 || neighbors === 3) {
                    //individual cell in  new 2d array
                      newBoard[y][x] = true;
                  } else {
                      newBoard[y][x] = false;
                  }
              } else {
                  if (!board[y][x] && neighbors === 3) {
                      newBoard[y][x] = true;
                  }
              }
          }
      }

    setGen((gen) => gen + 1);
    console.log('hi')
    setBoard(newBoard);
    setCells(() => makeCells());
  }

  const mod = (n, m) => {
    return ((n % m) + m) % m;
  }

  const deepCopy = (oldArray) => {
    let newArray = oldArray.map((arr) => [...arr]);
  return newArray
  }

  const calculateNeighbors = (board, x, y) => {
    //initialize neighbor count
     let neighbors = 0;
     const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
     for (let i = 0; i < dirs.length; i++) {
        //setting reference to sub array surrounding x,y coordinates
         const dir = dirs[i];
         //vertical
         let y1 = y + dir[0];
         // horitzontal (:
         let x1 = x + dir[1];
        
        //Make all neighbor checks inbounds
         x1 = mod(x1, NUM_COLUMNS);
         y1 = mod(y1, NUM_ROWS); 
        // if neighbor exists apped neighbor count
         board[y1][x1] && neighbors++;

     }
     //reutrns the number of live neighbors
     return neighbors;
  }
  //overwrite interval
  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  }

  const handleClear = () => {
    stopGame();
    setBoard(() => makeEmptyBoard());
    setCells(() => makeCells());
    setGen(0);
    console.log('clear')
  }

  const handleRandom = () => {
      for (let y = 0; y < NUM_ROWS; y++) {
          for (let x = 0; x < NUM_COLUMNS; x++) {
              board[y][x] = (Math.random() >= 0.5);
          }
      }

      setCells(() => makeCells());
  }

  const handleGlider = () => {
    handleClear();
    //set the right indices in the 2d array:
    const gliderBoard = deepCopy(board);
    gliderBoard[1][1] = 1;
    gliderBoard[1][3] = 1;
    gliderBoard[2][2] = 1;
    gliderBoard[2][3] = 1;
    gliderBoard[3][2] = 1;

    setBoard(gliderBoard);

    //make the cells:
    setCells(() => makeCells());

  }

  const handleBlinker = () => {
    handleClear();
    //set the right indices in the 2d array:
    const blinkerBoard = deepCopy(board);
    blinkerBoard[14][18] = 1;
    blinkerBoard[14][19] = 1;
    blinkerBoard[14][20] = 1;
    //make the cells:
    setBoard(blinkerBoard);
    setCells(() => makeCells());
  }

  const handleEater = () => {
    handleClear();
    //set the right indices in the 2d array:
    const eaterBoard = deepCopy(board);
    eaterBoard[12][16] = 1;
    eaterBoard[12][17] = 1;
    eaterBoard[13][16] = 1;
    eaterBoard[13][17] = 1;

    eaterBoard[14][18] = 1;
    eaterBoard[14][19] = 1;
    eaterBoard[15][18] = 1;
    eaterBoard[15][19] = 1;

    //make the cells:
    setCells(() => makeCells());
  }


  //event handler within render function to allow user to toggle cells to true(on) onClick.
  return (
    <div className="page">
      <div>current gen: {gen}</div>
      <div className="Board"
        style = {{ overflow: 'auto', resize: 'both', minWidth: PX_WIDTH, minHeight: PX_HEIGHT,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}} onClick={handleClick}
        ref= { (n) => {boardRef = n}}>
        {cells.map(cell => (<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
        ))}
      </div>
      <div className="controls">
        Update every <input value={interval} onChange={handleIntervalChange} /> msec
        {isRunning ?
          <button className="button"
            onClick={stopGame}>Stop</button> :
          <button className="button"
            onClick={runGame}>Run</button>
        }
        <div>
          <button className="button" onClick={handleRandom}>Random</button>
          <button className="button" onClick={handleGlider}>Gilder</button>
          <button className="button" onClick={handleBlinker}>Blinker</button>
          <button className="button" onClick={handleEater}>Eater</button>
          <button className="button" onClick={handleClear}>Clear</button>
        </div>
      </div>
      <div className="rules">
        <div>
          <h1>Rules:</h1>
          <p>1. <strong>Births</strong>: Each <strong className = "dead"> dead </strong> cell adjacent to exactly three live neighbors will become <strong className = "live">live</strong> in the next generation.
          </p>
          <p>2. <strong>Death by isolation</strong>: Each <strong className = "live">live</strong> cell with one or fewer live neighbors will <strong className = "dead"> die </strong> in the next generation.
          </p>
          <p>3. <strong>Death by overcrowding</strong>: Each <strong className = "live">live</strong> cell with four or more live neighbors will <strong className = "dead"> die </strong> in the next generation.
          </p>
          <p>4. <strong>Survival</strong>: Each <strong className = "live">live</strong> cell with either two or three live neighbors will remain <strong className = "live">alive</strong> for the next generation.
          </p>
        </div>
        <div className = "about">
          <h2>About the algorithm</h2>
          <p>This implementation uses a double buffering technique with a 2d array. Cells are loaded onto a secondary matrix and states of life and death are kept track on the old matrix. Neighbors are caclulated by using a directional array to check the rectangle around squares. Then for each iteration the algorithim checks to see the number of live neighbors and implements the rules accordingly. </p>
          <p>Conways Game of life was written in the 70s as a solution to John VonNoumen's hypothetical self replicating machine. It is of theortical interest because the game of life has the power of a universal turing machine which means any computation that can be computed algoritimically can be computed using the game of life. </p>
          <p>Paul randall impleneted a Turing complete version which can be found <a href = "http://rendell-attic.org/gol/tm.htm"target = "_blank" rel="noopener noreferrer">here</a></p>

        </div>
      </div>
    </div>
  );
}