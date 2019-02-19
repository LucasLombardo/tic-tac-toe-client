import * as Vivus from 'vivus'
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

const updateTurn = (turn, won = false) => {
    if (!won) {
        $(`#player-turn-message`).text(`${turn.toUpperCase()}'s turn`)
    } else {
        $(`#player-turn-message`).text(`Game is over.`)
    }
}

const resetGameMessage = () => {
    $(`#game-message`).text(``)
}

const clearBoard = () => {
    $(`.gameboard--marker`).text(``)
}

const displayGameHistory = payload => {
    // sort array of finished games by id
    const sortedGames = payload.games.sort((a, b) => Number(a.id) - Number(b.id))
    // create ordered array of gameBoards
    const gameBoards = sortedGames.map(game => game.cells)
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
    // if there were no gameBoards, notify user
    if (!gameBoards.length) {
        tableContents = `<p>You haven't finished any games yet,<br/> play a game or refresh to view games.</p>`
    }
    // set table's html to newly constructed tableContents
    $(`#game-history`).html(tableContents)
    $(`#get-game-history`).text(`Refresh Game History`)
}

const clearGameHistory = () => {
    $(`#get-game-history`).text(`View Game History`)
    $(`#game-history`).html(``)
}

const askToSignIn = () => {
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
