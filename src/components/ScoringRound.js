import * as React from 'react';

export default class ScoringRound extends React.Component {
	constructor(props) {
		super(props);

		let scores = new Array(this.props.players.length).fill(null);
		this.state = {
			scores,
			submitDisabled: true
		};

		this.changePlayerScore = this.changePlayerScore.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetBids = this.resetBids.bind(this);
		this.checkScores = this.checkScores.bind(this);
	}

	changePlayerScore(player, event) {
		let scores = this.state.scores.slice();
		scores[player] = event.target.value;

		this.setState({ scores });
		this.checkScores(scores);
	}

	checkScores(scores) {
		let message = null;
		let submitDisabled = true;

		let submittedScoresCount = scores.filter((el) => el !== null).length;

		if (submittedScoresCount < this.props.players.length) {
			message = 'Waiting for all players to score.';
		} else {
			let scoresSum = 0;
			this.props.players.forEach((player, index) => {
				scoresSum += parseInt(scores[index], 10);
			});

			if (scoresSum !== this.props.cardsCount) {
				message = `Scores don't add up to ${this.props.cardsCount}`;
			} else {
				submitDisabled = false;
			}
		}

		this.setState({ message, submitDisabled });
	}

	handleSubmit() {
		this.props.onSubmit(this.state.scores);
	}

	resetBids() {
		if (window.confirm('Are you sure you want to reset this hand?')) {
			this.props.onReset();
		}
	}

	renderScoreOptions(playerIndex, player) {
		let options = [];
		for (let i = 0; i <= this.props.cardsCount; i++) {
			options.push(i);
		}

		return (
			options.map(i => {
				return (
					<label className="radio-inline">
					  <input 
					  	type="radio"
					  	name={"player" + playerIndex}
					  	value={ i }
					  	onChange={ (e) => this.changePlayerScore(playerIndex, e) } />
					  {i} { i === parseInt(this.props.bids[player.id], 10) ? "(OK)" : null }
					</label>
				);
			})
		)
	}

	render() {
		return (
			<div>
				{ this.props.players.map((player, index) => {
					return (
						<div>
							{ player.name }:
							<br/>
							{ this.renderScoreOptions(index, player) }
							<br/><br/>
						</div>
					)
				}) }

				<div className="message">
                    { this.state.message }
                </div>

				<button 
					className="btn btn-default pull-right"
					onClick={ this.resetBids }
                >
					Reset Bids
				</button>
				
				<button 
					className="btn btn-success"
					onClick={ this.handleSubmit }
					disabled={ this.state.submitDisabled }
                >
					Finish round
				</button>
			</div>
		);
	}
}