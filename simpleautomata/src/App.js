import React, { Component } from 'react';
import './styles/App.css';
import Game from './logic/game.jsx'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game></Game>
      </div>
    );
  }
}

export default App;
