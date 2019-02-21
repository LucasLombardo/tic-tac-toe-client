const Gameboard = require(`./gameboard`)
const ui = require(`./ui`)
const api = require(`./api`)
const store = require(`../store`)

// initialize gameboard object
const board = new Gameboard()

const selectSpace = target => {
    const currTurn = board.turn
    // if valid space selected, print to ui
    const space = target.dataset.marker
    if (board.selectCell(space)) {
        ui.updateCell(target, currTurn)
        // update ui with current turn
        ui.updateTurn(board.turn)
        // if game won, print to the ui
        if (board.winner) {
            ui.displayWinner(board.winner)
            ui.updateTurn(board.winner, true)
        }
        // assemble object for PATCH request to update API
        const patchObj = {
            "game": {
                "cell": {
                    "index": space,
                    "value": currTurn,
                },
                "over": Boolean(board.winner),
            },
        }
        // pass assembled object to API
        api.updateGame(patchObj)
        // return true if space selection was valid
        return true
    } else {
        // notify user and return false if space selection was invalid
        ui.invalidCell()
        return false
    }
}

const reset = () => {
    if (!store.requestlimits.reset) {
        // limit reset requests to one per half second
        store.requestlimits.reset = true
        setTimeout(() => {
            store.requestlimits.reset = false
        }, 500)
        // reset board
        board.reset()
        // create game in api, will return promise if user logged in, undefined if not
        const game = api.createGame()
        // if user was logged in, write gameId to store
        game && game.then(() => {
            store.gameId = game.responseJSON.game.id
        })
        // reset ui and update the turn
        ui.resetGameMessage()
        ui.clearBoard()
        ui.updateTurn(board.turn)
    }
}

const getBoard = () => {
    // shares current board cells and turn with other files
    return { cells: board.cells, turn: board.turn, }
}

const getBoardWinner = () => {
    // checks current board for winner and shares the result ('x','o','tie', or null)
    board.checkForWinner()
    return board.winner
}

module.exports = { selectSpace, reset, getBoard, getBoardWinner, }
