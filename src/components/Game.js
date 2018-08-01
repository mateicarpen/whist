import * as React from 'react';
import {connect} from "react-redux";

import StartScreen from './StartScreen';
import AddPlayersForm from './AddPlayersForm';
import BiddingRound from './BiddingRound';
import ScoringRound from './ScoringRound';
import ScoreBoard from './ScoreBoard';
import ResetGameButton from './ResetGameButton';
import {addBids, addPlayers, addScores, resetBids, resetGame, startGame} from "../actions";

const mapStateToProps = state => {
    return {
        gameState: state.gameState,
        players: state.players,
        rounds: state.rounds,
        round: state.round,
        history: state.history,
        currentBids: state.currentBids
    }
};

const mapDispatchToProps = dispatch => {
    return {
        startGame: () => dispatch(startGame()),
        addPlayers: (players, round) => dispatch(addPlayers(players, round)),
        addBids: (bids, history) => dispatch(addBids(bids, history)),
        resetBids: (history) => dispatch(resetBids(history)),
        addScores: (round, history) => dispatch(addScores(round, history)),
        resetGame: () => dispatch(resetGame())
    };
};

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.startGame = this.startGame.bind(this);
        this.addPlayers = this.addPlayers.bind(this);
        this.addBids = this.addBids.bind(this);
        this.scoreRound = this.scoreRound.bind(this);
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
        let orderedBids = [];
        let players = this.getOrderedPlayers();
        let history = Object.assign({}, this.props.history);

        players.forEach((player, index) => {
           orderedBids[player.id] = bids[index];
        });

        history[this.props.round] = {
            bids: orderedBids
        };

        this.props.addBids(orderedBids, history);
    }

    resetBids() {
        let history = Object.assign({}, this.props.history);

        history[this.props.round] = null;

        this.props.resetBids(history);
    }

    scoreRound(scores) {
        let orderedScores = [];
        let round = this.props.round;
        let history = Object.assign({}, this.props.history);
        let players = this.getOrderedPlayers();

        players.forEach((player, index) => {
            orderedScores[player.id] = scores[index];
        });

        history[round] = {
            bids: this.props.currentBids,
            scores: orderedScores
        };

        this.props.addScores(round, history);
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
        for (let i = 1; i <= this.props.round; i++) {
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
            case "notStarted":
                page = <StartScreen handler = { this.startGame } />;
                break;

            case "addPlayers":
                page = <AddPlayersForm handler = { this.addPlayers } />;
                break;

            case "bid":
                page = <BiddingRound
                            cards = { this.props.rounds[this.props.round] }
                            players = { this.getOrderedPlayers() }
                            addBids = { this.addBids }
                       />;
                break;

            case "score":
                page = <ScoringRound
                            cards = { this.props.rounds[this.props.round] }
                            players = { this.getOrderedPlayers() }
                            bids = { this.props.currentBids }
                            scoreRound = { this.scoreRound }
                            resetBids = { this.resetBids }
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
                            Round #{this.props.round + 1} ({this.props.rounds[this.props.round]} cards)
                        </h2>
                        : null}

                    { page }
                </div>
                <div className="col-xs-12 col-sm-6">
                    { this.gameOngoing() || this.gameFinished() ?
                        <ScoreBoard
                            history = { this.props.history }
                            currentBids = { this.props.currentBids }
                            players = { this.props.players }
                            rounds = { this.props.rounds }
                        />
                        : null}

                    { this.gameOngoing() || this.gameFinished() ?
                        <ResetGameButton resetGame = { this.resetGame } />
                        : null}
                </div>
            </div>
        );
    }

    gameOngoing() {
        return this.props.gameState === "bid" || this.props.gameState === "score";
    }

    gameFinished() {
        return this.props.gameState === 'finished';
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);