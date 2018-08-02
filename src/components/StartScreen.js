import * as React from 'react';
import PropTypes from 'prop-types';

function StartScreen(props) {
	return (
		<button
			className="btn btn-success startButton"
			onClick={ props.onSubmit }
		>
			Start Game
		</button>
	);
}

StartScreen.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default StartScreen;