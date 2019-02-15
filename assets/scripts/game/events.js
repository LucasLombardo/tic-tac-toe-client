const game = require(`./game`)

const onSelectSpace = event => {
    // set space on board
    game.selectSpace(event.target)
}

const onReset = () => {
    // reset board
    game.reset()
}

module.exports = { onSelectSpace, onReset, }
