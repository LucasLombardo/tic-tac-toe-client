const game = require(`./game`)
const api = require(`./api`)
const ui = require(`./ui`)
const store = require(`../store`)
const ai = require(`./ai`)

const onSelectSpace = event => {
    // set space on board
    game.selectSpace(event.target)
    // get board
    setTimeout(() => {
        const board = game.getBoard()
        const aiPick = ai.chooseCell(board.cells, board.turn)
        const target = document.querySelector(`.gameboard--marker[data-marker='${aiPick}']`)
        game.selectSpace(target)
    }, 100)
}

const onReset = () => {
    // reset board
    game.reset()
}

const onGetGameHistory = () => {
    // fetch game history
    if (store.user.token) {
        if (!store.requestlimits.getGameHistory) {
            // limit requests to one per second
            store.requestlimits.getGameHistory = true
            setTimeout(() => {
                store.requestlimits.getGameHistory = false
            }, 1000)
            api.getGameHistory().then(ui.displayGameHistory)
        }
        return true
    } else {
        ui.askToSignIn()
        return false
    }
}

module.exports = { onSelectSpace, onReset, onGetGameHistory, }
