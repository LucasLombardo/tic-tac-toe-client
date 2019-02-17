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
        const patchedGame = api.updateGame(patchObj)
    } else {
        ui.invalidCell()
    }
}

const reset = () => {
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

module.exports = { selectSpace, reset, }
