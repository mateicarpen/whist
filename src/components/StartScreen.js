import * as React from 'react';

export default function StartScreen(props) {
	return (
		<button onClick={props.handler}>Start Game</button>
	);
}