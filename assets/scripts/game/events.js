const game = require(`./game`)
const api = require(`./api`)
const ui = require(`./ui`)
const store = require(`../store`)

const onSelectSpace = event => {
    // set space on board
    game.selectSpace(event.target)
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
    } else {
        ui.askToSignIn()
    }
}

module.exports = { onSelectSpace, onReset, onGetGameHistory, }
