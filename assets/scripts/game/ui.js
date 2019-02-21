import Vivus from 'vivus'
import svg from './svgs'
const messages = require(`../messages`)
const shuffleArr = require(`../../../lib/shuffleArr`)
const Gameboard = require(`./gameboard`)
const store = require(`../store`)

// note there are two paragraph tags for displaying messages in the HTML
// #game-message for displaying winner messages, #player-turn-message for turns

const updateCell = (target, currTurn) => {
    // create unique id to give the svg
    const svgId = `svg-${target.dataset.marker}`
    const svgArr = (currTurn === `x`) ? svg.Xs : svg.Os
    // select random one of 5 svgs in the array
    $(target).html(svgArr[Math.floor(Math.random() * 5)])
    // give the svg the unique id
    $(target).children().attr(`id`, svgId)
    // start Vivus.js animation (animation is side effect of constructor)
    // NOTE: duration is in frames not time, oneByOne means one svg path at a time, no delay between them
    // eslint-disable-next-line
    new Vivus(svgId, { duration: 25, type: `oneByOne`, })
    // clear game message
    $(`#game-message`).text(``)
}

const invalidCell = () => {
    // select a random invalidMove message to display
    $(`#game-message`).text(shuffleArr(messages.invalidMove)[0])
}

const displayWinner = winner => {
    if (winner.length === 1) {
        // if game was not a tie, display relevant message based on gamepiece that won and whether in AI mode
        if (store.settings.isVsAi) {
            const msg = winner === `o` ? shuffleArr(messages.broWins)[0] : shuffleArr(messages.userWins)[0]
            $(`#game-message`).text(msg)
        } else {
            $(`#game-message`).text(`Winner is ${winner.toUpperCase()}. Reset board to play again!`)
        }
    } else {
        // otherwise display a random tie message (same for singleplayer and AI)
        $(`#game-message`).text(shuffleArr(messages.tie)[0])
    }
}

const updateTurn = (turn, won = false) => {
    if (!won) {
        // if game not won, check if in AI or singleplayer mode then display relevant message
        if (store.settings.isVsAi) {
            const msg = turn === `o` ? shuffleArr(messages.brosTurn)[0] : shuffleArr(messages.usersTurn)[0]
            $(`#player-turn-message`).text(msg)
        } else {
            $(`#player-turn-message`).text(`${turn.toUpperCase()}'s turn.`)
        }
    } else {
        // if game won display random message that game is over
        $(`#player-turn-message`).text(shuffleArr(messages.gameOver)[0])
    }
}

const resetGameMessage = () => {
    $(`#game-message`).text(``)
}

const clearBoard = () => {
    // NOTE: jQuery seems to automatically iterate over node lists, this selection expected to be length 9
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
                <td>${winner.toUpperCase()}</td> 
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
}

const clearGameHistory = () => {
    // clear table data and headers
    $(`#game-history`).html(``)
}

const askToSignIn = () => {
    // if user tries action not permitted while unsigned in, notify them and select first field of auth forms
    $(`#auth-message`).text(`Who do you know here, chief?! You need to be logged in to do that.`)
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
