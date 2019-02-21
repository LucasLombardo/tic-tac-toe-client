const Gameboard = require(`./gameboard`)
const shuffleArr = require(`../../../lib/shuffleArr`)
// shuffleArr algorithm taken from Fisher Yates algorithm

// helper functions

const countOpenCells = function (cells) {
    // counts remaining open cells, returns the count
    return cells.filter(cell => cell).length
}

const isWinnable = function (cells, gamepiece) {
    // checks if game is winnable by given gamepiece, returns the index of win or undefined
    for (let i = 0; i < 9; i++) {
        // loop through each space checking if it would win the game
        const testSpace = new Gameboard(gamepiece, [ ...cells, ])
        testSpace.selectCell(i)
        if (testSpace.checkForWinner()) return i
    }
    return undefined
}

const rotateClockwise = function (cells) {
    // rotates an array of cells clockwise, returns rotated array
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

const isForked = function (cells, gamepiece) {
    // checks if game is forked by gamepiece, returns boolean
    let testCells = [ ...cells, ] // copy cells
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
    // if no fork found, return false
    return false
}

const isForkable = function (cells, gamepiece) {
    // takes cells and a gamepiece and returns index to fork if forkable, undefined if unforkable
    for (let i = 0; i < 9; i++) {
        // loop through cells, checking if placing gamepiece there creates a fork
        const test = new Gameboard(gamepiece, [ ...cells, ])
        if (test.selectCell(i)) {
            // if cell is selectable and it causes a fork, return cell
            if (isForked(test.cells, gamepiece)) return i
        }
    }
    return undefined
}

const selectCorner = function (cells, opponentGamepiece) {
    // selects a corner space if available, returns index or undefined if no corners open
    // check if there is an opposite corner available
    if (cells[0] === opponentGamepiece && cells[8] === ``) return 8
    if (cells[8] === opponentGamepiece && cells[0] === ``) return 0
    if (cells[2] === opponentGamepiece && cells[6] === ``) return 6
    if (cells[6] === opponentGamepiece && cells[2] === ``) return 2
    // check for empty corner, return random empty corner
    const corners = shuffleArr([ 0, 2, 6, 8, ])
    for (let i = 0; i < 4; i++) {
        if (!cells[corners[i]]) return corners[i]
    }
    return undefined
}

const selectSide = function (cells) {
    // selects a random open side, returns the index if available, undefined if not
    const sides = shuffleArr([ 1, 5, 7, 3, ])
    for (let i = 0; i < 4; i++) {
        if (!cells[sides[i]]) return sides[i]
    }
    return undefined
}

// eslint-disable-next-line
const print = function (cells) {
    // arranges cells in a grid for logging to console
    const str = cells.map(cell => (cell || ` `)).join(`|`)
    console.log(`|` + str.slice(0, 6))
    console.log(`|` + str.slice(6, 12))
    console.log(`|` + str.slice(12, 17) + `|`)
}

const rand1to100 = function () {
    // selects a random number from 1 to 100
    return Math.floor(Math.random() * 100) + 1
}

const chooseCell = function (cells, gamepiece, difficulty) {
    // chooses a cell for ai to pick, based on a given difficulty level 0-2
    // returns the index of selection, undefined if gameboard is full

    const opponentGamepiece = gamepiece === `x` ? `o` : `x`

    // DIFFICULTY LOGIC
    // Based on difficulty, select % of the time to do correct move. Use random
    // number from 1 to 100 to set a boolean to true if rule should be ignored.
    // Array order [ easy, med, hard ], selected via index by difficulty param.
    const checkToBlockWin = [ 40, 80, 92, ][ difficulty ] > rand1to100()
    const checkToFork = [ 30, 70, 92, ][ difficulty ] > rand1to100()
    const checkToBlockFork = [ 20, 70, 85, ][ difficulty ] > rand1to100()

    // MAIN AI LOGIC
    // Follow steps from Newell and Simon's 1972 tic-tac-toe program

    // 1) if first move select a random corner or center space
    if (!countOpenCells(cells)) {
        // if all cells are open, return random corner or center
        return [ 0, 2, 4, 6, 8, ][Math.floor(Math.random() * 5)]
    }

    // 2) check if winnable, if so return space to win; concat board squares to avoid mutation
    const winnable = isWinnable(cells, gamepiece)
    if (winnable !== undefined) return winnable

    // 3) check if block needed
    if (checkToBlockWin) {
        const blockable = isWinnable(cells, opponentGamepiece)
        if (blockable !== undefined) return blockable
    }

    // 4) check for fork opportunity
    if (checkToFork) {
        const forkable = isForkable(cells, gamepiece)
        if (forkable !== undefined) return forkable
    }

    // 5) check for fork block
    if (checkToBlockFork) {
        const forkBlockable = isForkable(cells, opponentGamepiece)
        if (forkBlockable !== undefined) return forkBlockable
    }

    // 6) check for center
    if (cells[4] === ``) return 4

    // 7) check for opposite corner to opponent or empty corner
    const selectCornerResult = selectCorner(cells, opponentGamepiece)
    if (selectCornerResult !== undefined) return selectCornerResult

    // 8) check for empty side
    const selectSideResult = selectSide(cells)
    if (selectSideResult !== undefined) return selectSideResult
}

module.exports = { chooseCell, }
