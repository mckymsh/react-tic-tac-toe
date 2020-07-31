import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BOARD_DIM = 3;

function Square(props){
	return(
		<button 
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component{
	renderSquare(i){
		return(
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)} 
			/>
		);
	}

	renderRow(y){
		const cellNums = Array.from(Array(BOARD_DIM).keys());
		const row = cellNums.map((column, cellNum) => {
			return this.renderSquare((y*BOARD_DIM)+cellNum)
		});
		return(
			<div className="board-row">{row}</div>
		);
	}

	render(){
		const rowNums = Array.from(Array(BOARD_DIM).keys());
		const board = rowNums.map((rowNum, row) => {
			return(
				<div>
					{this.renderRow(row)}
				</div>
			);
		});
		return board;
	}
}

class Game extends React.Component{
	selectedMove = 0;
	constructor(props){
		super(props);
		this.state={
			history: [{
				squares: Array(9).fill(null),
				lastMove: null,
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}
	handleClick(i){
		// window.alert(i);
		const history = this.state.history.slice(
			0, this.state.stepNumber+1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const currentMove = i;
		this.selectedMove = this.state.stepNumber+1;
		if(calculateWinner(squares) || squares[i]){
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				lastMove: currentMove,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	jumpTo(step){
		// document.getElementsByClassName('jump-button').
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
		this.selectedMove = step;
	}
	render(){
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			var coords = oneDToTwoD(history[move].lastMove);
			const desc = move ?
				'Go to move #' + move + ' {' + coords[0] + ',' + coords[1] + '}' :
				'Go to game start';
			// There has GOT to be a better way to do this.
			if(move === this.selectedMove){
				return(
					<li key={move} /* id={{move}}*/>
						<button class="jump-button bold" onClick={() => this.jumpTo(move)}>
							{desc}
						</button>
					</li>
				);
			}else{
				return(
					<li key={move} /* id={{move}}*/>
						<button class="jump-button" onClick={() => this.jumpTo(move)}>
							{desc}
						</button>
					</li>
				);
			}
		});

		let status;
		if(winner){
			status = 'Winner: ' + winner;
		}else{
			status ='Next player: ' +
				(this.state.xIsNext ? 'X' : 'O');
		}
		return(
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares){
	// ***check diagonal wins***
	// top-left to bottom-right
	// if first square isn't blank
	if(squares[twoDToOneD(0, 0)]){
		// store it
		var startSquare = squares[twoDToOneD(0, 0)];
		// for each column/row positive
		for(var i = 1; i < BOARD_DIM; i++){
			// if not same as first
			if(squares[twoDToOneD(i, i)] !== startSquare){
				break;
			}
			// if last column/row
			else if(i === BOARD_DIM-1){
				// return first aka winner
				return startSquare;
			}
		}
	}
	// bottom-left to top-right
	if(squares[twoDToOneD(0, BOARD_DIM-1)]){
		var startSquare = squares[twoDToOneD(0, BOARD_DIM-1)];
		for(var i = 1; i < BOARD_DIM-1; i++){
			if(squares[twoDToOneD(i, BOARD_DIM-1-i)] !== startSquare){
				break;
			}
			else if(i === BOARD_DIM-1){
				return startSquare;
			}
		}
	}
	// ***check vertical wins***
	// for each column
	for(var x = 0; x < BOARD_DIM; x++){
		if(squares[twoDToOneD(x, 0)]){
			var startSquare = squares[twoDToOneD(x, 0)];
			// for rows other than first
			for(var y = 1; y < BOARD_DIM; y++){
				// if different from first square
				if(squares[twoDToOneD(x, y)] !== startSquare){
					// exit for loop
					break;
				}
				// else if last row
				else if(y === BOARD_DIM-1){
					// return first aka the winner
					return startSquare;
				}
			}
		}
	}
	// ***check horizontal wins***
	for(var y = 0; y < BOARD_DIM; y++){
		if(squares[twoDToOneD(0, y)]){
			var startSquare = squares[twoDToOneD(0, y)];
			// for rows other than first
			for(var x = 1; x < BOARD_DIM; x++){
				// if different from first square
				if(squares[twoDToOneD(x, y)] !== startSquare){
					// exit for loop
					break;
				}
				// else if last row
				else if(x === BOARD_DIM-1){
					// return first aka the winner
					return startSquare;
				}
			}
		}
	}

	return null;
}

function oneDToTwoD(coordinate){
	var x = coordinate % BOARD_DIM;
	var y = Math.floor(coordinate / BOARD_DIM);
	return [x, y];
}

function twoDToOneD(x, y){
	return (y*BOARD_DIM) + x;
}

ReactDOM.render(
	<Game/>,
	document.getElementById('root')
);