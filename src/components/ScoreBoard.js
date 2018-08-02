import * as React from 'react';
import PropTypes from 'prop-types';

class ScoreBoard extends React.Component {
    constructor(props) {
        super(props);

        this.calculateScores = this.calculateScores.bind(this);
    }

    render() {
        let scores = this.calculateScores();

        return (
            <div className="scoreBoard">
                <h2>Score Board</h2>

                <table border="1">
                    <thead>
                    <tr>
                        <td>&nbsp;</td>
                        { this.props.players.map(function (name, index) {
                            return <th key={ index } colSpan="2">{ name }</th>
                        }) }
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.rounds.map((round, roundNo) => {
                        return (
                            <tr key={ roundNo }>
                                <td>{ round }</td>

                                { this.props.players.map(function (name, playerNo) {
                                    let score = scores[roundNo][playerNo];
                                    let bidClasses = ["bid"];

                                    if (score.wrong) {
                                        bidClasses.push("wrong");
                                    }

                                    if (score.positivePrize) {
                                        bidClasses.push("positivePrize");
                                    }

                                    if (score.negativePrize) {
                                        bidClasses.push("negativePrize");
                                    }

                                    return [
                                        <td key={ 'score' + playerNo } className="score">
                                            { score.score }
                                        </td>,
                                        <td key={ 'bid' + playerNo } className={ bidClasses.join(" ") }>
                                            { score.bid }
                                        </td>
                                    ];
                                }) }
                            </tr>
                        );
                    }) }
                    </tbody>
                </table>
            </div>
        );
    }

    /**
     * Returns an array of type:
     * scores[round][player] = {
     *   bid: 2,
     *   score: 50,
     *   wrong: false,
     *   positivePrize: true,
     *   negativePrize: false
     * }
     *
     * @return array
     */
    calculateScores() {
        let scores = [];
        let totalRounds = this.props.rounds.length;
        let totalPlayers = this.props.players.length;

        for (let player = 0; player < totalPlayers; player++) {
            let wonInARow = 0;
            let lostInARow = 0;
            let score = 0;

            for (let round = 0; round < totalRounds; round++) {
                let bid;
                let wrong = false;
                let positivePrize = false;
                let negativePrize = false;

                if (this.props.history[round] && this.props.history[round]['scores']) {
                    bid = this.props.history[round]['bids'][player];
                    let actual = this.props.history[round]['scores'][player];
                    let cardsPerRound = this.props.rounds[round];

                    if (bid === actual) {
                        score += 5 + bid;
                        lostInARow = 0;

                        if (cardsPerRound > 1) {
                            wonInARow++;
                        }

                        if (wonInARow === 5) {
                            score += 10;
                            positivePrize = true;
                            wonInARow = 0;
                        }
                    } else {
                        score -= Math.abs(bid - actual);
                        wrong = true;
                        wonInARow = 0;

                        if (cardsPerRound > 1) {
                            lostInARow++;
                        }

                        if (lostInARow === 5) {
                            score -= 10;
                            negativePrize = true;
                            lostInARow = 0;
                        }
                    }
                } else {
                    score = null;

                    if (this.props.history[round]) {
                        bid = this.props.history[round]['bids'][player];
                    }
                }

                if (!scores[round]) {
                    scores[round] = [];
                }

                scores[round][player] = {
                    bid: bid,
                    score: score,
                    wrong: wrong,
                    positivePrize: positivePrize,
                    negativePrize: negativePrize,
                };
            }
        }

        return scores;
    }
}

ScoreBoard.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object).isRequired,
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
    rounds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ScoreBoard;