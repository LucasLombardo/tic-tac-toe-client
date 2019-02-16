const updateCell = (target, currTurn) => {
    $(target).text(currTurn)
    $(`#game-message`).text(``)
}

const invalidCell = () => {
    $(`#game-message`).text(`Sorry, that cell is invalid`)
}

const displayWinner = winner => {
    if (winner.length === 1) {
        $(`#game-message`).text(`Winner is ${winner.toUpperCase()}. Reset board to play again!`)
    } else {
        $(`#game-message`).text(`Tie game. Reset board to play again!`)
    }
}

const updateTurn = turn => {
    $(`#player-turn-message`).text(`${turn.toUpperCase()}'s turn`)
}

const resetGameMessage = () => {
    $(`#game-message`).text(``)
}

const clearBoard = () => {
    $(`.gameboard--marker`).text(``)
}

const displayGames = (gamesPlayed) => {
    if (gamesPlayed !== undefined) {
        $(`#games-played-message`).text(`you've played ${gamesPlayed} games`)
    } else {
        $(`#games-played-message`).text(``)
    }
}

module.exports = {
    updateCell,
    invalidCell,
    displayWinner,
    updateTurn,
    resetGameMessage,
    clearBoard,
    displayGames,
}
