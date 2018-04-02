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
		this.resetBids = this.resetBids.bind(this);
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

	resetBids() {
		if (window.confirm('Are you sure you want to reset this hand?')) {
			this.props.resetBids();
		}
	}

	renderScoreOptions(playerIndex, player) {
		let options = [];
		for (let i = 0; i <= this.props.cards; i++) {
			options.push(i);
		}

		// TODO: sa pasez si bids deja ordonate in componenta, ca sa nu mai aiba nevoie de player id?

		return (
			options.map(i => {
				return (
					<div>
						<input type="radio" name={"player" + playerIndex} value={i} onChange={(e) => this.changePlayerScore(playerIndex, e)}/> 
						{i} {i == this.props.bids[player.id] ? "(OK)" : null}
					</div>
				);
			})
		)
	}

	render() {
		return (
			<div>
				{ this.props.players.map(function(player, index) {
					return (
						<div>
							{player.name} (Bid: {this.props.bids[player.id]}): {this.renderScoreOptions(index, player)}
							<br/>
						</div>
					)
				}.bind(this)) }

				<button onClick={this.resetBids}>Reset Bids</button>
				<button onClick={this.handleSubmit}>Finish round</button>
			</div>
		);
	}
}