import * as React from 'react';

export default class BiddingRound extends React.Component {
    constructor(props) {
        super(props);

        let bids = new Array(this.props.players.length).fill(null);
        this.state = {
            bids,
            submitDisabled: true
        };

        this.changePlayerBid = this.changePlayerBid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    changePlayerBid(player, event) {
        let bids = Object.assing({}, this.state.bids);
        bids[player] = event.target.value;

        this.setState({ bids });

        this.checkBids();
    }

    checkBids() {
        let message = null;
        let submitDisabled = true;

        let bidsExceptLastPlayer = this.state.bids
            .slice(0, -1)
            .filter((el) => el !== null)
            .length;

        if (bidsExceptLastPlayer < this.props.players.length - 1) {
            // Not all players (except the last) submitted their bid
            message = 'Waiting for all players to bid.';
        } else {
            let bidsSum = 0;

            // don't add last player's bid
            for (let i = 0; i < this.props.players.length - 1; i++) {
                if (state.bids[i] !== null) {
                    bidsSum += parseInt(state.bids[i]);
                }
            }

            let notAllowed = null;
            if (bidsSum <= this.props.cards) {
                notAllowed = this.props.cards - bidsSum;
                message = 'Last player not allowed to bid ' + notAllowed + '.';
            } else {
                message = 'Last player can bid anything.';
            }

            let lastPlayerBid = this.state.bids[this.props.players.length - 1];
            if (lastPlayerBid !== null && parseInt(lastPlayerBid) !== notAllowed) {
                state.submitDisabled = false;
            }
        }

        this.setState({ message, submitDisabled });
    }

    handleSubmit() {
        this.props.addBids(this.state.bids);
    }

    renderBidOptions(playerIndex) {
        let options = [];
        for (let i = 0; i <= this.props.cards; i++) {
            options.push(i);
        }

        return (
            options.map(i => {
                return (
                    <label className="radio-inline">
                        <input
                            type = "radio"
                            name = { "player" + playerIndex }
                            id = { "inlineRadio" + playerIndex }
                            value = { i }
                            onChange={ (e) => this.changePlayerBid(playerIndex, e) } />
                        {i}
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
                            { this.renderBidOptions(index) }
                            <br/><br/>
                        </div>
                    )
                }) }

                <div className="message">
                    { this.state.message }
                </div>

                <button
                    className = "btn btn-success"
                    onClick = { this.handleSubmit }
                    disabled = { this.state.submitDisabled }
                >
                    Done bidding
                </button>
            </div>
        );
    }
}