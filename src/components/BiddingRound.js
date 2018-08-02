import * as React from 'react';
import PropTypes from 'prop-types';

class BiddingRound extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bids: new Array(this.props.players.length).fill(null),
            submitDisabled: true
        };

        this.handleChangePlayerBid = this.handleChangePlayerBid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangePlayerBid(player, event) {
        let bids = this.state.bids.slice();
        bids[player] = parseInt(event.target.value, 10);

        this.setState({ bids });
        this.checkBids(bids);
    }

    checkBids(bids) {
        let message = null;
        let submitDisabled = true;

        let bidsExceptLastPlayer = bids
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
                if (bids[i] !== null) {
                    bidsSum += parseInt(bids[i], 10);
                }
            }

            let notAllowed = null;
            if (bidsSum <= this.props.cardsCount) {
                notAllowed = this.props.cardsCount - bidsSum;
                message = 'Last player not allowed to bid ' + notAllowed + '.';
            } else {
                message = 'Last player can bid anything.';
            }

            let lastPlayerBid = bids[this.props.players.length - 1];
            if (lastPlayerBid !== null && parseInt(lastPlayerBid, 10) !== notAllowed) {
                submitDisabled = false;
            }
        }

        this.setState({ message, submitDisabled });
    }

    handleSubmit() {
        this.props.onSubmit(this.state.bids);
    }

    renderBidOptions(playerIndex) {
        let options = [];
        for (let i = 0; i <= this.props.cardsCount; i++) {
            options.push(i);
        }

        return (
            options.map(i => {
                return (
                    <label key={ i } className="radio-inline">
                        <input
                            type="radio"
                            name={ "player" + playerIndex }
                            id={ "inlineRadio" + playerIndex }
                            value={ i }
                            onChange={ (e) => this.handleChangePlayerBid(playerIndex, e) }/>
                        { i }
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
                        <div key={ index }>
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
                    className="btn btn-success"
                    onClick={ this.handleSubmit }
                    disabled={ this.state.submitDisabled }
                >
                    Done bidding
                </button>
            </div>
        );
    }
}

BiddingRound.propTypes = {
    cardsCount: PropTypes.number.isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default BiddingRound;