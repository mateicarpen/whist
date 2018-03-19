import * as React from 'react';

export default class ScoringRound extends React.Component {
	constructor(props) {
		super(props);

		let scores = new Array(this.props.players.length).fill(null);
		this.state = {
			scores: scores
		}

		this.changePlayerScore = this.changePlayerScore.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	changePlayerScore(player, event) {
		let scores = this.state.scores;
		scores[player] = event.target.value;

		this.setState({
			scores: scores
		});
	}

	handleSubmit() {
    	// TODO: sa verific ca au fost completate toate persoanele (in componenta respectiva)
    	// La fel si pt componenta de bids

		this.props.scoreRound(this.state.scores);
	}

	renderScoreOptions(player) {
		let options = [];
		for (let i = 0; i <= this.props.cards; i++) {
			options.push(i);
		}

		return (
			options.map(i => {
				return (
					<div>
						<input type="radio" name={"player" + player} value={i} onChange={(e) => this.changePlayerScore(player, e)}/> 
						{i} {i == this.props.bids[player] ? "(OK)" : null}
					</div>
				);
			})
		)
	}

	render() {
		return (
			<div>
				{ this.props.players.map(function(name, index) {
					return (
						<div>
							{name} (Bid: {this.props.bids[index]}): {this.renderScoreOptions(index)}
							<br/>
						</div>
					)
				}.bind(this)) }

				<button onClick={this.handleSubmit}>Finish round</button>
			</div>
		);
	}
}