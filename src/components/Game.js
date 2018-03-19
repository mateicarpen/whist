import * as React from 'react';

import StartScreen from './StartScreen';
import AddPlayersForm from './AddPlayersForm';
import BiddingRound from './BiddingRound';
import ScoringRound from './ScoringRound';
import ScoreBoard from './ScoreBoard';

export default class Game extends React.Component {
  constructor(props) {
  	super(props);

  	// game state: notStarted, addPlayers, bid, score, finished
  	this.state = {
  		gameState: "notStarted"
  	};

  	this.startGame = this.startGame.bind(this);
  	this.addPlayers = this.addPlayers.bind(this);
  	this.addBids = this.addBids.bind(this);
    this.scoreRound = this.scoreRound.bind(this);
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
  	let state = this.state;

  	state["currentBids"] = bids;
  	state["gameState"] = "score";
    state["history"][state.round] = {
      bids: bids
    };

  	this.setState(state);
  }

  scoreRound(scores) {
    let state = this.state;

    state.history[state.round] = {
      bids: this.state.currentBids,
      scores: scores
    };
    state.currentBids = null;

    if (state.round < state.rounds.length - 1) {
      state.round++;
      state.gameState = "bid";
    } else {
      state.gameState = "finished";
    }

    this.setState(state);
  }

  render() {
  	let page = null;

  	switch (this.state.gameState) {
  		case "notStarted":
  			page = <StartScreen handler={this.startGame}/>
  			break;

  		case "addPlayers":
  			page = <AddPlayersForm handler={this.addPlayers}/>
  			break;

  		case "bid":
  			page = <BiddingRound cards={this.state.rounds[this.state.round]} players={this.state.players} addBids={this.addBids}/>
  			break;

  		case "score":
  			page = <ScoringRound cards={this.state.rounds[this.state.round]} players={this.state.players} bids={this.state.currentBids} scoreRound={this.scoreRound}/>
  			break;
  	}

    return (
      <div className="game row">
        <div className="column">
          { this.gameOngoing() ? <h2>Round #{ this.state.round + 1 } ({this.state.rounds[this.state.round]} cards)</h2> : null }
          { page }
        </div>
        <div className="column">
          { this.gameOngoing() || this.gameFinished() ? <ScoreBoard history={this.state.history} currentBids={this.state.currentBids} players={this.state.players} rounds={this.state.rounds}/> : null}
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
}