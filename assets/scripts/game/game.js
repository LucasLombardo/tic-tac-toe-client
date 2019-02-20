const Gameboard = require(`./gameboard`)
const ui = require(`./ui`)
const api = require(`./api`)
const store = require(`../store`)

// initialize gameboard object
const board = new Gameboard()

const selectSpace = target => {
    console.log(`//////////////`)
    console.log(`selectSpace`)
    console.log(target)
    console.log(`//////////////`)
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
        // assemble object to update api
        const patchObj = {
            "game": {
                "cell": {
                    "index": space,
                    "value": currTurn,
                },
                "over": Boolean(board.winner),
            },
        }
        // pass assembled object to api
        api.updateGame(patchObj)
        return true
    } else {
        ui.invalidCell()
        return false
    }
}

const reset = () => {
    if (!store.requestlimits.reset) {
        // limit requests to one per second
        store.requestlimits.reset = true
        setTimeout(() => {
            store.requestlimits.reset = false
        }, 1000)
        // reset board
        board.reset()
        // create game in api
        const game = api.createGame()
        // if user was logged in, write gameId to store
        game && game.then(() => {
            store.gameId = game.responseJSON.game.id
        })
        // reset ui game message
        ui.resetGameMessage()
        ui.clearBoard()
        ui.updateTurn(board.turn)
    }
}

const getBoard = () => {
    return { cells: board.cells, turn: board.turn, }
}

const getBoardWinner = () => {
    board.checkForWinner()
    return board.winner
}

module.exports = { selectSpace, reset, getBoard, getBoardWinner, }
