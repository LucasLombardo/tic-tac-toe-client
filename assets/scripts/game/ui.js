const updateCell = (space, currTurn) => {
    console.log(`updateCell space:${space} turn:${currTurn}`)
    console.log($(`.gameboard--space:nth-of-type(${space})`))
    $(`.gameboard--space:nth-of-type(${Number(space) + 1})`).text(currTurn)
    $(`#game-message`).text(``)
}

const invalidCell = () => {
    $(`#game-message`).text(`Sorry, that cell is invalid`)
}

const displayWinner = winner => {
    if (winner.length === 1) {
        $(`#game-message`).text(`Winner is ${winner.toUpperCase()}. Reset board to play again!`)
    } else {
        $(`game-message`).text(`Tie game. Reset board to play again!`)
    }
}

module.exports = { updateCell, invalidCell, displayWinner, }
