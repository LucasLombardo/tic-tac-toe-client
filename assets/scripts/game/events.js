const game = require(`./game`)
const api = require(`./api`)
const ui = require(`./ui`)
const store = require(`../store`)
const ai = require(`./ai`)
const config = require(`../config`)

const onSelectSpace = event => {
    // ignore request if it is AI's turn still
    if (store.requestlimits.selectSpace) return
    // try to select that space (selectSpace will return false if space invalid)
    if (game.selectSpace(event.target)) {
        // if space selection was successful, get board and winner (null if no winner)
        const board = game.getBoard()
        const winner = game.getBoardWinner()
        // if game isn't over and AI is set to on, trigger an AI move
        if (!winner && store.settings.isVsAi) {
            // get the index of AI pick and select the element of that marker
            const aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty)
            const target = document.querySelector(`.gameboard--marker[data-marker='${aiPick}']`)
            // block space selection while AI is taking turn
            store.requestlimits.selectSpace = true
            setTimeout(() => {
                // select space after timeout, timeout needed to not overload the API
                game.selectSpace(target)
                // allow space selection after timeout finishes
                store.requestlimits.selectSpace = false
            }, config.appSettings.aiDelay)
        }
    }
}

const onReset = () => {
    // reset board
    game.reset()
    const board = game.getBoard()
    // if turn is "O", select space for AI (tic tac brO is always O)
    if (board.turn === `o` && store.settings.isVsAi) {
        const aiPick = ai.chooseCell(board.cells, board.turn, store.settings.difficulty)
        const target = document.querySelector(`.gameboard--marker[data-marker='${aiPick}']`)
        // block space selection while ai is taking turn
        store.requestlimits.selectSpace = true
        setTimeout(() => {
            // select space after timeout, timeout needed to not overload the API
            game.selectSpace(target)
            // allow space selection after timeout finishes
            store.requestlimits.selectSpace = false
        }, config.appSettings.aiDelay)
    }
}

const onGetGameHistory = () => {
    // if user is logged in, get the game history
    if (store.user.token) {
        // make sure user isn't spamming requests since it will overload API
        if (!store.requestlimits.getGameHistory) {
            // limit requests to one per second
            store.requestlimits.getGameHistory = true
            setTimeout(() => {
                store.requestlimits.getGameHistory = false
            }, 1000)
            // get history then pass payload to ui function
            api.getGameHistory().then(ui.displayGameHistory)
        }
        return true
    } else {
        // if user not logged in ask them to sign in
        ui.askToSignIn()
        return false
    }
}

module.exports = { onSelectSpace, onReset, onGetGameHistory, }
