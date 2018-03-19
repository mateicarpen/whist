import * as React from 'react';

export default class BiddingRound extends React.Component {
	constructor(props) {
		super(props);

		let bids = new Array(this.props.players.length).fill(null);
		this.state = {
			bids: bids
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
	}

	handleSubmit() {
		this.props.addBids(this.state.bids);
	}

	renderBidOptions(player) {
		let options = [];
		for (let i = 0; i <= this.props.cards; i++) {
			options.push(i);
		}

		return (
			options.map(i => {
				return (
					<div>
						<input type="radio" name={"player" + player} value={i} onChange={(e) => this.changePlayerBid(player, e)}/> {i}
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
							{name}: {this.renderBidOptions(index)}
							<br/>
						</div>
					)
				}.bind(this)) }

				<button onClick={this.handleSubmit}>Done bidding</button>
			</div>
		);
	}
}