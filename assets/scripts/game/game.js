const Gameboard = require(`./gameboard`)
const ui = require(`./ui`)
const api = require(`./api`)
const store = require(`../store`)

// initialize gameboard object
const board = new Gameboard()

const updateFinishedGames = () => {
    console.log(`updateFinishedGames`)
    if (store.user.token) {
        // if user logged in, get played games
        api.getFinishedGames().then((payload) => {
            ui.displayGames(payload.games.length)
        })
    } else {
        ui.displayGames()
    }
}

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
            updateFinishedGames()
            ui.displayWinner(board.winner)
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
        // if user was logged in, log the api payload
        patchedGame && patchedGame.then(console.log(patchedGame))
    } else {
        ui.invalidCell()
    }
    updateFinishedGames()
    board.printCells()
}

const reset = () => {
    console.log(`reset game`)
    // reset board
    board.reset()
    // create game in api
    const game = api.createGame()
    console.log(game)
    // if user was logged in, write gameId to store
    game && game.then(() => {
        console.log(`reset game, set id`)
        store.gameId = game.responseJSON.game.id
    })
    // reset ui game message
    ui.resetGameMessage()
    ui.clearBoard()
    ui.updateTurn(board.turn)
    updateFinishedGames()
}

module.exports = { selectSpace, reset, updateFinishedGames, }
