import { ADD_BIDS, ADD_PLAYERS, ADD_SCORES, RESET_BIDS, RESET_GAME, START_GAME } from "./action-types";

export const startGame = () => ({
    type: START_GAME
});

export const addPlayers = (players, rounds) => ({
    type: ADD_PLAYERS,
    payload: { players, rounds }
});

export const addBids = (bids) => ({
    type: ADD_BIDS,
    payload: { bids }
});

export const resetBids = () => ({
    type: RESET_BIDS
});

export const addScores = (scores) => ({
    type: ADD_SCORES,
    payload: { scores }
});

export const resetGame = () => ({
    type: RESET_GAME
});