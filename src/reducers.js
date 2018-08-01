import {ADD_BIDS, ADD_PLAYERS, ADD_SCORES, RESET_BIDS, RESET_GAME, START_GAME} from "./action-types";

let savedState = JSON.parse(localStorage.getItem('game-state') || 'false');
const initialState = savedState ? savedState : {
    gameState: "notStarted"
};

const getState = (state = initialState, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                gameState: "addPlayers"
            };

        case ADD_PLAYERS:
            return {
                gameState: "bid",
                players: action.payload.players,
                rounds: action.payload.rounds,
                round: 0,
                history: []
            };

        case ADD_BIDS:
            return {
                ...state,
                gameState: "score",
                currentBids: action.payload.bids,
                history: action.payload.history
            };

        case RESET_BIDS:
            return {
                ...state,
                gameState: "bid",
                currentBids: null,
                history: action.payload.history
            };

        case ADD_SCORES:
            let gameState = action.payload.round < state.rounds.length ? "bid" : "finished";

            return {
                ...state,
                currentBids: null,
                gameState: gameState,
                round: action.payload.round,
                history: action.payload.history
            };

        case RESET_GAME:
            return initialState;

        default:
            return state;
    }
};

export function rootReducer(state, action) {
    let newState = getState(state, action);

    localStorage.setItem('game-state', JSON.stringify(newState));

    return newState;
}