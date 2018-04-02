import * as React from 'react';

export default class BiddingRound extends React.Component {
	constructor(props) {
		super(props);

		let bids = new Array(this.props.players.length).fill(null);
		this.state = {
			bids: bids,
			submitDisabled: true
		}

		this.changePlayerBid = this.changePlayerBid.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	changePlayerBid(player, event) {
		let bids = this.state.bids;
		bids[player] = event.target.value;

		this.setState({
			bids: bids
		});

		this.checkBids();
	}

	checkBids() {
		let state = this.state;
		let bidsSoFar = state.bids.filter((el) => el !== null).length;

		state.message = null;

		if (bidsSoFar < this.props.players.length) {
			let lastPlayerBid = state.bids[this.props.players.length - 1];

			// only last player remaining
			if (bidsSoFar == this.props.players.length - 1 && lastPlayerBid === null) {
				let bidsSum = 0;

				for (let i = 0; i < this.props.players.length; i++) {
					if (state.bids[i] !== null) {
						bidsSum += parseInt(state.bids[i]);
					}
				}

				if (bidsSum <= this.props.cards) {
					let notAllowed = this.props.cards - bidsSum;
					state.message = 'Last player not allowed to bid' + notAllowed + '.';
				}
			} else {
				state.message = 'Waiting for all players to bid.';
			}
		} else {
			// al players have submitted their bid
		}

		this.setState(state);
	}

	handleSubmit() {
		this.props.addBids(this.state.bids);
	}

	renderBidOptions(playerId) {
		let options = [];
		for (let i = 0; i <= this.props.cards; i++) {
			options.push(i);
		}

		return (
			options.map(i => {
				return (
					<div>
						<input type="radio" name={"player" + playerId} value={i} onChange={(e) => this.changePlayerBid(playerId, e)}/> {i}
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
							{player.name}: {this.renderBidOptions(player.id)}
							<br/>
						</div>
					)
				}.bind(this)) }

				<div className="message">{ this.state.message }</div>

				<button onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Done bidding</button>
			</div>
		);
	}
}