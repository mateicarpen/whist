import * as React from 'react';

export default class ScoreBoard extends React.Component {
	constructor(props) {
		super(props);

		this.calculateScore = this.calculateScore.bind(this);
	}

	render() {
		console.log(this.props);

		return (
			<div className="scoreBoard">
				<h2>Score Board</h2>

				<table border="1">
					<thead>
						<tr>
							<td>&nbsp;</td>
							{ this.props.players.map(function(name) {
								return <th colSpan="2">{name}</th>
							}) }
						</tr>
					</thead>
					<tbody>
						{ this.props.rounds.map(function(round, roundNo) {
							return (
								<tr>
									<td>{round}</td>
									{ this.props.players.map(function(name, playerNo) {
										let score = this.calculateScore(roundNo, playerNo);
										let bid = this.props.history[roundNo] ? this.props.history[roundNo]['bids'][playerNo] : '';
										let actual = this.props.history[roundNo] && this.props.history[roundNo]['scores'] ? this.props.history[roundNo]['scores'][playerNo] : ''
										let isWrong = this.props.history[roundNo] && bid !== actual;
										let shouldGetPrize = this.props.history[roundNo] && this.props.history[roundNo]['scores'] && this.shouldGetPrize(roundNo, playerNo);

										return [
											<td className="score">{ score }</td>,
											<td className={"bid " + (isWrong ? 'wrong' : '') + (shouldGetPrize ? "prize" : "")}>{ bid }</td>
										];
									}.bind(this)) }
								</tr>
							);
						}.bind(this)) }
					</tbody>
				</table>
			</div>
		);
	}

	calculateScore(roundNo, playerNo) {
		if (!this.props.history[roundNo] || !this.props.history[roundNo]['scores']) {
			return null;
		}

		let score = 0;

		for (let i = 0; i <= roundNo; i++) {
			let bid = this.props.history[i]['bids'][playerNo];
			let actual = this.props.history[i]['scores'][playerNo]
		
			if (bid === actual) {
				score += 5 + parseInt(bid);
				
				if (this.shouldGetPrize(i, playerNo)) {
					score += 10;
				}
			} else {
				score -= Math.abs(bid - actual);
				
				if (this.shouldGetPrize(i, playerNo)) {
					score -= 10;
				}
			}
		}

		return score;
	}

	// TODO: refactor this
	shouldGetPrize(roundNo, playerNo) {
		if (!this.props.history[roundNo] || !this.props.history[roundNo]['scores']) {
			return null;
		}

		let wonHandsNeeded = 5;
		let round = roundNo;
		let totalRounds = this.props.rounds.length;
		let playersNo = this.props.players.length;

		let lastBid = this.props.history[roundNo]['bids'][playerNo];
		let lastActual = this.props.history[roundNo]['scores'][playerNo];
		let checkLostInstead = (lastBid !== lastActual);

		while (wonHandsNeeded) {
			// check if it's a 1-card game (no prize given for those)
			if (round < playersNo || round >= totalRounds - playersNo) {
				return false;
			}

			// check if hand was won
			let bid = this.props.history[round]['bids'][playerNo];
			let actual = this.props.history[round]['scores'][playerNo];
			if (bid !== actual || (checkLostInstead && bid === actual)) {
				return false;
			}

			round--;
			wonHandsNeeded--;
		}

		// next round needs to be lost, so that we only award the prize once
		
		// check if it's a 1-card game (no prize given for those)
		if (round < playersNo || round >= totalRounds - playersNo) {
			return true;
		}

		// check if hand was won
		let bid = this.props.history[round]['bids'][playerNo];
		let actual = this.props.history[round]['scores'][playerNo];
		if (bid !== actual || (checkLostInstead && bid === actual)) {
			return true;
		}

		return false;
	}
}