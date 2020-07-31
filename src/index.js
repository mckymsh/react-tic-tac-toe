import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const boardDim = 3;

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

	render(){
		return(
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
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
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for(let i = 0; i < lines.length; i++){
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] ===
			squares[b] && squares[a] ===
			squares[c]
		){
			return squares[a];
		}
	}
	return null;
}

function oneDToTwoD(coordinate){
	var x = coordinate % boardDim;
	var y = Math.floor(coordinate / boardDim);
	return [x, y];
}

ReactDOM.render(
	<Game/>,
	document.getElementById('root')
);