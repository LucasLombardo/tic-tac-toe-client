const game = require(`./game`)
const api = require(`./api`)
const ui = require(`./ui`)
const store = require(`../store`)
const ai = require(`./ai`)

const onSelectSpace = event => {
    // set space on board
    if (game.selectSpace(event.target)) {
        // if space selection was successful, check if AI should move
        const board = game.getBoard()
        const winner = game.getBoardWinner()
        if (!winner && store.settings.isVsAi) {
            const aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty)
            const target = document.querySelector(`.gameboard--marker[data-marker='${aiPick}']`)
            game.selectSpace(target)
        }
    }
}

const onReset = () => {
    // reset board
    game.reset()
    // if turn is o, select space for Ai
    const board = game.getBoard()
    if (board.turn === `o` && store.settings.isVsAi) {
        const aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty)
        const target = document.querySelector(`.gameboard--marker[data-marker='${aiPick}']`)
        game.selectSpace(target)
    }
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
