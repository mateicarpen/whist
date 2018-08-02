import * as React from 'react';
import {connect} from 'react-redux';

import StartScreen from './StartScreen';
import AddPlayersForm from './AddPlayersForm';
import BiddingRound from './BiddingRound';
import ScoringRound from './ScoringRound';
import ScoreBoard from './ScoreBoard';
import ResetGameButton from './ResetGameButton';
import {addBids, addPlayers, addScores, resetBids, resetGame, startGame} from '../state/actions';
import {ADDING_PLAYERS, BID, FINISHED, NOT_STARTED, SCORE} from '../state/game-states';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    return {
        gameState: state.gameState,
        players: state.players,
        rounds: state.rounds,
        currentRound: state.currentRound,
        history: state.history
    }
};

const mapDispatchToProps = dispatch => {
    return {
        startGame: () => dispatch(startGame()),
        addPlayers: (players, round) => dispatch(addPlayers(players, round)),
        addBids: (bids) => dispatch(addBids(bids)),
        resetBids: () => dispatch(resetBids()),
        addScores: (scores) => dispatch(addScores(scores)),
        resetGame: () => dispatch(resetGame())
    };
};

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.startGame = this.startGame.bind(this);
        this.addPlayers = this.addPlayers.bind(this);
        this.addBids = this.addBids.bind(this);
        this.addScores = this.addScores.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.resetBids = this.resetBids.bind(this);
    }

    startGame() {
        this.props.startGame();
    }

    addPlayers(players) {
        let rounds = this.buildRoundsArray(players.length);

        this.props.addPlayers(players, rounds);
    }

    addBids(bids) {
        let players = this.getOrderedPlayers();
        let orderedBids = [];

        players.forEach((player, index) => {
           orderedBids[player.id] = bids[index];
        });

        this.props.addBids(orderedBids);
    }

    resetBids() {
        this.props.resetBids();
    }

    addScores(scores) {
        let orderedScores = [];
        let players = this.getOrderedPlayers();

        players.forEach((player, index) => {
            orderedScores[player.id] = scores[index];
        });

        this.props.addScores(orderedScores);
    }

    resetGame() {
        this.props.resetGame();
    }

    getOrderedPlayers() {
        let players = this.props.players.slice();

        players.forEach((player, index) => {
            players[index] = {
                id: index,
                name: player
            }
        });

        // don't rotate on the first round
        for (let i = 1; i <= this.props.currentRound; i++) {
            players = this.rotateArray(players);
        }

        return players;
    }

    rotateArray(array) {
        array.push(array.shift());

        return array;
    }

    buildRoundsArray(noOfPlayers) {
        let rounds = [];

        for (let i = 1; i <= noOfPlayers; i++) {
            rounds.push(1);
        }

        for (let i = 2; i <= 7; i++) {
            rounds.push(i);
        }

        for (let i = 1; i <= noOfPlayers; i++) {
            rounds.push(8);
        }

        for (let i = 7; i >= 2; i--) {
            rounds.push(i);
        }

        for (let i = 1; i <= noOfPlayers; i++) {
            rounds.push(1);
        }

        return rounds;
    }

    render() {
        let page = null;

        switch (this.props.gameState) {
            case NOT_STARTED:
                page = <StartScreen onSubmit={ this.startGame } />;
                break;

            case ADDING_PLAYERS:
                page = <AddPlayersForm onSubmit={ this.addPlayers } />;
                break;

            case BID:
                page = <BiddingRound
                            cardsCount={ this.getCurrentCardsCount() }
                            players={ this.getOrderedPlayers() }
                            onSubmit={ this.addBids }
                       />;
                break;

            case SCORE:
                page = <ScoringRound
                            cardsCount={ this.getCurrentCardsCount() }
                            players={ this.getOrderedPlayers() }
                            bids={ this.getCurrentBids() }
                            onSubmit={ this.addScores }
                            onReset={ this.resetBids }
                       />;
                break;

            default:
                page = '';
        }

        return (
            <div className="game row">
                <div className="col-xs-12 col-sm-6">
                    { this.gameOngoing() ?
                        <h2>
                            Round #{this.props.currentRound + 1} ({ this.getCurrentCardsCount() } cards)
                        </h2>
                        : null}

                    { page }
                </div>
                <div className="col-xs-12 col-sm-6">
                    { this.gameOngoing() || this.gameFinished() ?
                        <ScoreBoard
                            history={ this.props.history }
                            players={ this.props.players }
                            rounds={ this.props.rounds }
                        />
                        : null}

                    { this.gameOngoing() || this.gameFinished() ?
                        <ResetGameButton onClick={ this.resetGame } />
                        : null}
                </div>
            </div>
        );
    }

    gameOngoing() {
        return this.props.gameState === BID || this.props.gameState === SCORE;
    }

    gameFinished() {
        return this.props.gameState === FINISHED;
    }

    getCurrentBids() {
        if (this.props.history[this.props.currentRound]) {
            return this.props.history[this.props.currentRound].bids;
        }

        return null;
    }

    getCurrentCardsCount() {
        return this.props.rounds[this.props.currentRound];
    }
}

Game.propTypes = {
    gameState: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.string),
    rounds: PropTypes.arrayOf(PropTypes.number),
    currentRound: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.object)
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);