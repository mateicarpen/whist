import * as React from 'react';

export default class ScoringRound extends React.Component {
	constructor(props) {
		super(props);

		let scores = new Array(this.props.players.length).fill(null);
		this.state = {
			scores: scores,
			submitDisabled: true
		}

		this.changePlayerScore = this.changePlayerScore.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetBids = this.resetBids.bind(this);
		this.checkScores = this.checkScores.bind(this);
	}

	changePlayerScore(player, event) {
		let scores = this.state.scores;
		scores[player] = event.target.value;

		this.setState({
			scores: scores
		});

		this.checkScores();
	}

	checkScores() {
		let state = this.state;
		state.message = null;
		state.submitDisabled = true;

		let noPlayersWithScore = state.scores.filter((el) => el !== null).length;

		if (noPlayersWithScore < this.props.players.length) {
			state.message = 'Waiting for all players to score.';
		} else {
			let scoresSum = 0;
			for (let i = 0; i < this.props.players.length; i++) {
				scoresSum += parseInt(state.scores[i]);
			}

			if (scoresSum !== this.props.cards) {
				state.message = 'Scores don\'t add up to ' + this.props.cards;
			} else {
				state.submitDisabled = false;
			}
		}

		this.setState(state);
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
					<label class="radio-inline">
					  <input 
					  	type="radio" 
					  	name={"player" + playerIndex} 
					  	value={i}
					  	onChange={(e) => this.changePlayerScore(playerIndex, e)} /> 
					  {i} {i == this.props.bids[player.id] ? "(OK)" : null}
					</label>
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
							{player.name}: 
							<br/>
							{this.renderScoreOptions(index, player)}
							<br/><br/>
						</div>
					)
				}.bind(this)) }

				<div className="message">{ this.state.message }</div>

				<button 
					className="btn btn-default pull-right" 
					onClick={this.resetBids}>
					Reset Bids
				</button>
				
				<button 
					className="btn btn-success"
					onClick={this.handleSubmit} 
					disabled={this.state.submitDisabled}>
					Finish round
				</button>
			</div>
		);
	}
}