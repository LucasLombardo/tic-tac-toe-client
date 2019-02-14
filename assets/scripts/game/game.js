const Gameboard = require(`./gameboard`)
const ui = require(`./ui`)

const board = new Gameboard()

const selectSpace = space => {
    console.log(`selectSpace ${space}`)
    const currTurn = board.turn
    // if valid space selected, print to ui
    if (board.selectCell(space)) {
        ui.updateCell(space, currTurn)
    }
    board.printCells()
}

module.exports = { selectSpace, }
