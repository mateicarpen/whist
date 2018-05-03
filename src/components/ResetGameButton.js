import * as React from 'react';

export default class ResetGameButton extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (window.confirm('Are you sure you want to reset this game?')) {
			this.props.resetGame();
		}
	}

	render() {
		return (
			<button className="btn btn-default" onClick={this.handleClick}>Reset Game</button>
		);
	}
}