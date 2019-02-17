const game = require(`./game`)
const api = require(`./api`)
const ui = require(`./ui`)

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
    api.getGameHistory().then(ui.displayGameHistory)
}

module.exports = { onSelectSpace, onReset, onGetGameHistory, }
