import React, { PureComponent } from "react";
const checkWin = squares => [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
].find(
	([a, b, c]) => squares[a] &&
		squares[a] === squares[b] &&
		squares[a] === squares[c]
);
const Square = ({ mark, click, value }) => (
	<button
		className="square"
		onClick={click}
		style={mark ? { color: "red" } : null}
	>{value}</button>
);
const Board = ({ squares, click, winline }) => {
	const squareAll = squares.map(
		(e, i) => <Square
			key={i} value={e}
			click={click(i)}
			mark={winline && winline.includes(i)}
		/>
	);
	const squareGroup = [];
	let i = 0;
	while (i < squareAll.length) {
		squareGroup.push(
			<div key={i} className="row">
				{squareAll.slice(i, i += 3)}
			</div>
		);
	}
	return <div className="all-square">{squareGroup}</div>;
};
class Game extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				desp: "Game start",
				idx: 0,
			}],
			nextX: true,
			step: 0,
			asc: true,
		};
	}
	fill = i => () => {
		const { history, nextX, step } = this.state;
		const squares = history[step].squares.slice();
		if (squares[i] || checkWin(squares)) {
			return null;
		}
		if (step < history.length) {
			history.splice(step + 1);
		}
		squares[i] = nextX ? "X" : "O";
		const col = i % 3;
		const row = (i - col) / 3;
		history.push({
			squares, idx: step + 1,
			desp: `fill ${squares[i]} into (row=${row + 1},col=${col + 1})`,
		});
		this.setState({
			history: history.slice(),
			nextX: !nextX,
			step: step + 1,
		});
	};
	jump = i => () => this.setState({
		step: i,
		nextX: !(i % 2),
	});
	toggle = () => this.setState({ asc: !this.state.asc });
	render() {
		const { history, nextX, step, asc } = this.state;
		const squares = history[step].squares;
		const winline = checkWin(squares);
		const winner = winline && squares[winline[0]];
		const historyDesc = history.slice().reverse();
		return (
			<div className="game">
				<div className="game-board">
					<Board click={this.fill}
						squares={squares}
						winline={winline}
					/>
				</div>
				<div className="game-info">
					<div>
						{winner ? `Winner: ${winner}`
							: `Next Player: ${nextX ? "X" : "O"}`}
						<br />
						{` Sort Order: ${asc ? "ASC" : "DESC"}`}
					</div>
					<button onClick={this.toggle}>reverse</button>
					<ol>
						{(asc ? history : historyDesc).map(
							({ desp, idx }) => (
								<li key={idx}>
									{/* eslint-disable-next-line */}
									<u onClick={this.jump(idx)}
										style={idx === step ? { color: "red" } : null}
									>{desp}</u>
								</li>
							)
						)}
					</ol>
				</div>
			</div>
		);
	}
}

export default Game;