const Gameboard = require(`./gameboard`)

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

const displayGameHistory = payload => {
    // get array of finished game boards
    const gameBoards = payload.games.map(game => game.cells)
    // construct contents for HTML display table, with game headers
    let tableContents = `
        <tr>
            <th>Game #</th>
            <th>Winner</th> 
            <th>Turns Taken</th>
        </tr>
    `
    // loop over every gameBoard and create a row to push to tableContents
    gameBoards.map((gameBoard, i) => {
        // create new gameboard object and run checkForWinner method
        const board = new Gameboard(`x`, gameBoard)
        board.checkForWinner()
        // set variables to insert into row
        const gameNumber = i + 1
        console.log(gameNumber)
        console.log(gameBoard)
        const winner = board.winner
        const turnsTaken = board.cells.filter(cell => cell).length
        // add row for current game to tableContents
        tableContents += `
            <tr>
                <td>${gameNumber}</td>
                <td>${winner}</td> 
                <td>${turnsTaken}</td>
            </tr>
        `
    })
    // set table's html to newly constructed tableContents
    $(`#game-history`).html(tableContents)
    $(`#get-game-history`).text(`Refresh Game History`)
}

const clearGameHistory = () => {
    $(`#get-game-history`).text(`View Game History`)
    $(`#game-history`).html(``)
}

const askToSignIn = () => {
    // $(`#sign-up-input`).reportValidity(`is not`)
    $(`#auth-message`).text(`You need to be logged in to do that!`)
    $(`#sign-up-input`).select()
}

module.exports = {
    updateCell,
    invalidCell,
    displayWinner,
    updateTurn,
    resetGameMessage,
    clearBoard,
    displayGameHistory,
    clearGameHistory,
    askToSignIn,
}
