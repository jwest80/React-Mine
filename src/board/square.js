import React, { Component } from 'react';
import './square.css';

class Square extends Component {

    render() {
        var props = this.props;
        if (this.props.isOpen) {
            if (this.props.isMine) {
                return <span className="square" style={{"background-color": "red"}}>۞</span>
            } else {
                return <span className="square"
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => this.props.onMouseDown(e)}
                onMouseUp={(e) => this.props.onMouseUp(e)}>{ this.props.score ? this.props.score : '' }</span>
            }
        } else if (this.props.isMark) {
            return <button className="square" 
                onClick={(e) => this.props.onClick(e)} 
                onContextMenu={(e) => this.props.onClick(e)}
                style={{"color": "red"}}>!</button>
        } else {
            return <button className="square" 
                onClick={(e) => this.props.onClick(e)} 
                onContextMenu={(e) => this.props.onClick(e)}></button>
        }
    }
}

export default Square;
