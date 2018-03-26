import * as React from 'react';

export default class AddPlayersForm extends React.Component {
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
		let players = this.state.players.split("\n").filter(function(name) {
			return name.trim().length > 1;
		});
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