import React, { Component } from 'react';
import './board.css';
import Square from './square';

class Board extends Component {

    constructor() {
        super();
        this.ROWS = 10;
        this.COLS = 10;
        this.state = {
            squareCount: this.ROWS * this.COLS,
            mineCount: 5,
            squares: [],
            leftDown: false,
            rightDown: false
        };
    }

    componentDidMount() { 
        this.init();
    }

    init() {
        var newBoard = [];
        for (var r = 0; r < this.ROWS; r++) {
            for (var c = 0; c < this.COLS; c++) {
                var square = {
                    row: r,
                    col: c,
                    isOpen: false,
                    isMark: false,
                    isMine: false,
                    score: 0
                }
                newBoard.push(square);
            }
        }
        this.addMines(newBoard, this.state.mineCount);
        this.setState({squares: newBoard}, function () {
        this.printGrid(newBoard);
        });
    }

    addMines(board, count) {
        // Randomly Add Mines
        while (count > 0) {
            var randomIndex = this.generateRandomInteger(0, this.state.squareCount);
            if (!(board[randomIndex].isMine)) {
                board[randomIndex].isMine = true;
                count--;
            }
        }
        // Update Scores
        for (var n = 0; n < this.state.squareCount; n++) {
            this.updateScore(board, n);
        }
    }

    updateScore(board, index) {
        var neighbors = this.getNeighbors(board, index);
        for(var n = 0; n < neighbors.length; n++) {
            if (neighbors[n].isMine) board[index].score++;
        }
    }

    getIndex(r,c) {
        return (r * this.COLS) + c;
    }

    isOnBoard(r,c) {
        return (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS);
    }

    getNeighbors(board, index) {
        var row = board[index].row;
        var col = board[index].col;
        var neighbors = [];
        for (var r = row -1; r <= row+1; r++ ) {
            for (var c = col -1; c <= col+1; c++ ) {
                if (this.isOnBoard(r,c)) {                          // On Board
                    if (this.getIndex(r,c) !== index) {             // Not Self
                        neighbors.push(board[this.getIndex(r,c)]);                 
                    }
                }
            }
        }
        return neighbors;
    }

    getMarkScore(board, index) {
        var markCount = 0;
        var neighbors = this.getNeighbors(board, index);
        for(var n = 0; n < neighbors.length; n++) {
            if (neighbors[n].isMark) markCount++
        }
        return markCount;
    }

    openUnmarkedNeighbors(board, index) {
        if (this.getMarkScore(board, index) === board[index].score) {
            var neighbors = this.getNeighbors(board, index);
            for(var n = 0; n < neighbors.length; n++) {
                if (!neighbors[n].isMark)
                    neighbors[n].isOpen = true;
            }
        }
    }

    generateRandomInteger(min, max) {
        return Math.floor(max - Math.random()*(max-min))
    }

    squareClicked(e, index, square) {
        console.log("onMouseClick");
        e.preventDefault();

        var board = this.state.squares;
        if (e.nativeEvent.which === 1) {            // Left Click
            if (board[index].isMine) {              // Hit Mine
                board[index].isOpen = true;         // Game over
            } else {
                this.expandSquares(board, square.row, square.col);
            }
        } else if (e.nativeEvent.which === 3) {         // Right Click
            board[index].isMark = !board[index].isMark; // Toggle Mark
        }
        this.setState({squares: board});
    }

    expandSquares(board, row, col) {
        if (this.isOnBoard(row,col)) {
            var index = this.getIndex(row,col);
            if (!board[index].isOpen) {
                board[index].isOpen = true;
                if(board[index].score === 0) {
                    this.expandSquares(board,row-1, col);
                    this.expandSquares(board,row+1, col);
                    this.expandSquares(board,row, col-1);
                    this.expandSquares(board,row, col+1);
                } 
            }
        }
    }

    printGrid(grid) {
        var gridString = "";
        for (var r = 0; r < this.ROWS; r++) {
            for (var c = 0; c < this.COLS; c++) {
                let value = ' ';
                let square = grid[this.getIndex(r,c)];
                if (square.isMine) {
                    value = '۞';
                } else {
                    value = square.score ? square.score : '■';
                }
                gridString += value + ' ';
            }
            gridString += "\n";
        }
        console.log(gridString);
    }

    onMouseDown(e, index, obj) {
        e.preventDefault();
        console.log('onMouseDown: ' + e.nativeEvent.which )
        if (e.nativeEvent.which === 1) {
            this.setState({leftDown: true})
        } else if(e.nativeEvent.which === 3) {
            this.setState({rightDown: true})
        }
    }
    onMouseUp(e, index, obj) {
        e.preventDefault();
        if(this.state.leftDown && this.state.rightDown) {
            var board = this.state.squares;
            this.openUnmarkedNeighbors(board, index);
            this.setState({squares: board});
        }

        console.log('onMouseUp: ' + e.nativeEvent.which )
        if (e.nativeEvent.which === 1) {
            this.setState({leftDown: false})
        } else if(e.nativeEvent.which === 3) {
            this.setState({rightDown: false})
        }
    }

    render() {
        var boardWidth = this.COLS * 20;
        var boardComponent = this;

        return (
            <div>
                <div className="board" style={{width: boardWidth + "px"}}>
                    {this.state.squares.map(function(obj, index){
                        return <Square 
                            key={index}
                            row={obj.row} 
                            col={obj.col}
                            score={obj.score}
                            isOpen={obj.isOpen}
                            isMine={obj.isMine}
                            isMark={obj.isMark}
                            onClick={(e) => boardComponent.squareClicked(e, index, obj)}
                            onMouseDown={(e) => boardComponent.onMouseDown(e, index, obj)}
                            onMouseUp={(e) => boardComponent.onMouseUp(e, index, obj)}></Square>
                    })}
                </div>
            </div>
        );
    }

}

export default Board;
