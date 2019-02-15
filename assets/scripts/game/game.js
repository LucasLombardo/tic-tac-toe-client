const Gameboard = require(`./gameboard`)
const ui = require(`./ui`)

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
        if (board.winner) ui.displayWinner(board.winner)
    } else {
        ui.invalidCell()
    }
    board.printCells()
}

const reset = () => {
    console.log(`reset game`)
    // reset board
    board.reset()
    // reset ui game message
    ui.resetGameMessage()
    ui.clearBoard()
    ui.updateTurn(board.turn)
}

module.exports = { selectSpace, reset, }
