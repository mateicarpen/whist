import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//// start game

function StartGameButton(props) {
	return (
		<button onClick={props.handler}>Start Game</button>
	);
}

//// choose players

class AddPlayersForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {players: ""}

		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({players: event.target.value})
	}

	handleSubmit(event) {
		let players = this.state.players.split("\n");
		this.props.handler(players);

		event.preventDefault();
	}

	render() {
		return (
			<div className="add-players-form">
				<h2>Add Players</h2>
				<p>Enter the names of the players, each on a separate line.</p>

				<textarea value={this.state.value} onChange={this.handleChange}></textarea>
				<button onClick={this.handleSubmit}>Done</button>
			</div>	
		);
	}	
}

//// hand

function BidOptions(props) {
	let options = [];
	for (let i = 0; i <= props.maxOption; i++) {
		options.push(i);
	}

	return (
		options.map(i => {
			return (
				<div>
					<input type="radio" name={"player" + props.player}/> {i}
				</div>
			);
		})
	)
}

class Hand extends React.Component {
	render() {
		return (
			<div>
				{ this.props.players.map(function(name, index) {
					return (
						<div>
							{name}: <BidOptions maxOption={this.props.cards} player={index}/>
							
							<br/>
						</div>
					)
				}.bind(this)) }
			</div>
		);
	}
}

//// game

class Game extends React.Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		gameStarted: false
  	};

  	this.startGame = this.startGame.bind(this); // TODO: wtf?
  	this.addPlayers = this.addPlayers.bind(this); // TODO: wtf?
  }

  startGame() {
  	this.setState({
  		gameStarted: true,
  		players: null
  	});
  }

  addPlayers(players) {
  	this.setState({
  		gameStarted: true,
  		players: players
  	});
  }

  render() {
  	let page = null;

  	if (!this.state.gameStarted) {
  		page = <StartGameButton handler={this.startGame}/>
  	} else {
  		if (!this.state.players) {
			page = <AddPlayersForm handler={this.addPlayers}/>
		} else {
			page = <Hand cards="3" players={this.state.players}/>
		}
  	}

    return (
      <div className="game">
        { page }
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
