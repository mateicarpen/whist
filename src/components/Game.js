import * as React from 'react';

import StartScreen from './StartScreen';
import AddPlayersForm from './AddPlayersForm';
import BiddingRound from './BiddingRound';
import ScoringRound from './ScoringRound';
import ScoreBoard from './ScoreBoard';
import ResetGameButton from './ResetGameButton';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        let savedState = JSON.parse(localStorage.getItem('game-state') || 'false');
        if (savedState) {
            this.state = savedState;
        } else {
            // game state: notStarted, addPlayers, bid, score, finished
            this.state = {
                gameState: "notStarted"
            };
        }

        this.startGame = this.startGame.bind(this);
        this.addPlayers = this.addPlayers.bind(this);
        this.addBids = this.addBids.bind(this);
        this.scoreRound = this.scoreRound.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.resetBids = this.resetBids.bind(this);
    }

    componentDidMount() {
        this._interval = setInterval(() => {
            localStorage.setItem('game-state', JSON.stringify(this.state));
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    startGame() {
        this.setState({
            gameState: "addPlayers"
        });
    }

    addPlayers(players) {
        let rounds = this.buildRoundsArray(players.length);

        this.setState({
            gameState: "bid",
            players: players,
            rounds: rounds,
            round: 0,
            history: []
        });
    }

    addBids(bids) {
        let orderedBids = [];
        let players = this.getOrderedPlayers();
        let history = Object.assign({}, this.state.history);

        players.forEach((player, index) => {
           orderedBids[player.id] = bids[index];
        });

        history[this.state.round] = {
            bids: orderedBids
        };

        this.setState({
            currentBids: orderedBids,
            gameState: "score",
            history: history
        });
    }

    resetBids() {
        let history = Object.assign({}, this.state.history);

        history[this.state.round] = null;

        this.setState({
            currentBids: [],
            gameState: "bid",
            history: history
        });
    }

    scoreRound(scores) {
        let gameState;
        let orderedScores = [];
        let round = this.state.round;
        let history = Object.assign({}, this.state.history);
        let players = this.getOrderedPlayers();

        players.forEach((player, index) => {
            orderedScores[player.id] = scores[index];
        });

        history[round] = {
            bids: this.state.currentBids,
            scores: orderedScores
        };

        if (round < this.state.rounds.length - 1) {
            round++;
            gameState = "bid";
        } else {
            gameState = "finished";
        }

        this.setState({
            currentBids: null,
            gameState: gameState,
            round: round,
            history: history
        });
    }

    resetGame() {
        this.setState({
            gameState: "notStarted"
        });
    }

    getOrderedPlayers() {
        let players = this.state.players.slice();

        players.forEach((player, index) => {
            players[index] = {
                id: index,
                name: player
            }
        });


        // don't rotate on the first round
        for (let i = 1; i <= this.state.round; i++) {
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

        switch (this.state.gameState) {
            case "notStarted":
                page = <StartScreen handler = { this.startGame } />;
                break;

            case "addPlayers":
                page = <AddPlayersForm handler = { this.addPlayers } />;
                break;

            case "bid":
                page = <BiddingRound
                            cards = { this.state.rounds[this.state.round] }
                            players = { this.getOrderedPlayers() }
                            addBids = { this.addBids }
                       />;
                break;

            case "score":
                page = <ScoringRound
                            cards = { this.state.rounds[this.state.round] }
                            players = { this.getOrderedPlayers() }
                            bids = { this.state.currentBids }
                            scoreRound = { this.scoreRound }
                            resetBids = { this.resetBids }
                       />;
                break;
        }

        return (
            <div className="game row">
                <div className="col-xs-12 col-sm-6">
                    { this.gameOngoing() ?
                        <h2>
                            Round #{this.state.round + 1} ({this.state.rounds[this.state.round]} cards)
                        </h2>
                        : null}

                    { page }
                </div>
                <div className="col-xs-12 col-sm-6">
                    { this.gameOngoing() || this.gameFinished() ?
                        <ScoreBoard
                            history = { this.state.history }
                            currentBids = { this.state.currentBids }
                            players = { this.state.players }
                            rounds = { this.state.rounds }
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
        return this.state.gameState === "bid" || this.state.gameState === "score";
    }

    gameFinished() {
        return this.state.gameState === 'finished';
    }
}