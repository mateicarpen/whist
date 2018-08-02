import * as React from 'react';

export default function StartScreen(props) {
	return (
		<button
			className="btn btn-success startButton"
			onClick={ props.onSubmit }
		>
			Start Game
		</button>
	);
}