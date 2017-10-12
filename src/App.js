import React, { Component } from 'react';
import './App.css';

import Board from './board/board'

class App extends Component {
  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Mine</h1>
        </header>

        <Board></Board>

      </div>
    );
  }
}

export default App;
