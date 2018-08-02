import {ADD_BIDS, ADD_PLAYERS, ADD_SCORES, RESET_BIDS, RESET_GAME, START_GAME} from "./action-types";
import {ADDING_PLAYERS, BID, FINISHED, NOT_STARTED, SCORE} from "./game-states";

const baseState = {
    gameState: NOT_STARTED
};

let savedState = JSON.parse(localStorage.getItem('game-state') || 'false');
const initialState = savedState ? savedState : baseState;

const getState = (state = initialState, action) => {
    let history;

    switch (action.type) {
        case START_GAME:
            return {
                gameState: ADDING_PLAYERS
            };

        case ADD_PLAYERS:
            return {
                gameState: BID,
                players: action.payload.players,
                rounds: action.payload.rounds,
                currentRound: 0,
                history: []
            };

        case ADD_BIDS:
            history = state.history.slice();
            history[state.currentRound] = { bids: action.payload.bids };

            return {
                ...state,
                gameState: SCORE,
                history: history
            };

        case RESET_BIDS:
            history = state.history.slice();
            history.splice(state.currentRound, 1);

            return {
                ...state,
                gameState: BID,
                history: history
            };

        case ADD_SCORES:
            let currentRound = state.currentRound;
            let gameState;
            history = state.history.slice();

            history[currentRound]['scores'] = action.payload.scores;

            if (currentRound < state.rounds.length - 1) {
                currentRound++;
                gameState = BID;
            } else {
                gameState = FINISHED;
            }

            return {
                ...state,
                gameState: gameState,
                currentRound: currentRound,
                history: history
            };

        case RESET_GAME:
            return baseState;

        default:
            return state;
    }
};

export function rootReducer(state, action) {
    let newState = getState(state, action);

    localStorage.setItem('game-state', JSON.stringify(newState));

    return newState;
}