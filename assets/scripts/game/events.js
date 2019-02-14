const game = require(`./game`)

const onSelectSpace = event => {
    // get space index of cell user clicked on
    const spaceIndex = event.target.dataset.marker
    // set space on board
    game.selectSpace(spaceIndex)
}

module.exports = { onSelectSpace, }
