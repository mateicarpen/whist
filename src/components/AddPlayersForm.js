import * as React from 'react';

export default class AddPlayersForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            players: event.target.value
        });
    }

    handleSubmit(event) {
        let players = this.state.players.split("\n").filter(function (name) {
            return name.trim().length > 0;
        });

        if (players.length >= 3 && players.length <= 6) {
            this.props.handler(players);
        } else {
            this.setState({
                errorMessage: "You need between 3 and 6 players to play this game"
            });
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className="add-players-form">
                <h2>Add Players</h2>
                <p>Enter the names of the players, each on a separate line.</p>

                <textarea
                    className = "form-control"
                    value = { this.state.value }
                    onChange = { this.handleChange }
                    rows = "6"
                ></textarea>

                <div className="message">
                    { this.state.errorMessage }
                </div>

                <button
                    className = "btn btn-success"
                    onClick = { this.handleSubmit }
                >
                    Done
                </button>
            </div>
        );
    }
}