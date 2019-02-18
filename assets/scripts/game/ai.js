const Gameboard = require(`./gameboard`)

/* eslint no-unused-vars: 0 no-var: 0  */
/* eslint prefer-const: 0 */

// helper functions

const countOpenCells = function (cells) {
    // counts remaining open cells
    return cells.filter(cell => cell).length
}

const isWinnable = function (cells, gamepiece) {
    // checks if game is winnable by gamepiece
    for (let i = 0; i < 9; i++) {
        // loop through each space checking if it would win the game
        const testSpace = new Gameboard(gamepiece, [ ...cells, ])
        testSpace.selectCell(i)
        if (testSpace.checkForWinner()) return i
    }
    return undefined
}

const rotateClockwise = function (cells) {
    // rotates a gameboard clockwise
    return [].concat(
        cells[6],
        cells[3],
        cells[0],
        cells[7],
        cells[4],
        cells[1],
        cells[8],
        cells[5],
        cells[2]
    )
}

let isForked = function (cells, gamepiece) {
    // check if game is forked by gamepiece, assumes game is not already won/winnable

    let testCells = [ ...cells, ]

    for (let i = 0; i < 4; i++) {
        // loop through 4 sides of the gameboard, rotating it clockwise on each iteration

        if (
            gamepiece === testCells[0] &&
            gamepiece === testCells[2] &&
            gamepiece === testCells[4]
        ) {
            // if first style of fork is set up, check if there are two open slots to win
            if ([ testCells[1], testCells[6], testCells[8], ].join().length < 4) { return true }
        }

        if (
            gamepiece === testCells[0] &&
            gamepiece === testCells[2] &&
            gamepiece === testCells[8]
        ) {
            // if second style of fork is set up, check if there are two open slots to win
            if ([ testCells[1], testCells[4], testCells[5], ].join().length < 4) { return true }
        }

        // rotate test cells
        testCells = rotateClockwise(testCells)
    }

    return false
}

const print = function (cells) {
    // arranges cells in a grid for logging to console
    const str = cells.map(cell => (cell || ` `)).join(`|`)
    console.log(`|` + str.slice(0, 6))
    console.log(`|` + str.slice(6, 12))
    console.log(`|` + str.slice(12, 17) + `|`)
}

var cells = [ `x`, `o`, `x`, `x`, ``, ``, ``, ``, ``, ]

let chooseCell = function (cells, gamepiece) {
    const opponentGamepiece = gamepiece === `x` ? `o` : `x`

    // 1) if first move select a random corner or center space
    if (countOpenCells(cells)) {
        return [ 0, 2, 4, 6, 8, ][Math.floor(Math.random() * 5)]
    }

    // 2) check if winnable, if so return space to win; concat board squares to avoid mutation
    const winnable = isWinnable(cells, gamepiece)
    if (winnable !== undefined) return winnable

    // 3) check if block needed
    const blockable = isWinnable(cells, opponentGamepiece)
    if (blockable !== undefined) return blockable

    // 4) check for fork opportunity

    // 5) check for fork block

    // 6) check for center
    if (cells[4] === ``) return 4

    // 7) check for opposite corner or empty corner

    // 8) check for empty side
}
