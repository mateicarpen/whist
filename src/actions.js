import {ADD_BIDS, ADD_PLAYERS, ADD_SCORES, RESET_BIDS, RESET_GAME, START_GAME} from "./action-types";

export const startGame = () => ({
    type: START_GAME
});

export const addPlayers = (players, rounds) => ({
    type: ADD_PLAYERS,
    payload: { players, rounds }
});

export const addBids = (bids, history) => ({
    type: ADD_BIDS,
    payload: { bids, history }
});

export const resetBids = (history) => ({
    type: RESET_BIDS,
    payload: { history }
});

export const addScores = (round, history) => ({
    type: ADD_SCORES,
    payload: { round, history }
});

export const resetGame = () => ({
    type: RESET_GAME
});