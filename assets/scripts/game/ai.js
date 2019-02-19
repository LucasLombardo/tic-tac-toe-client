const Gameboard = require(`./gameboard`)

/* eslint no-unused-vars: 0 no-var: 0  */
/* eslint prefer-const: 0 */

// helper functions

const countOpenCells = function (cells) {
    // console.log(`countOpenCells`)
    // counts remaining open cells
    return cells.filter(cell => cell).length
}

const isWinnable = function (cells, gamepiece) {
    // console.log(`isWinnable`)
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
    // console.log(`rotateClockwise`)
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
    // console.log(`isForked`)
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

const isForkable = function (cells, gamepiece) {
    // console.log(`isForkable`)
    // takes cells and a gamepiece and returns index to fork if forkable
    for (let i = 0; i < 9; i++) {
        // loop through cells, checking if placing gamepiece there creates a fork
        const test = new Gameboard(gamepiece, [ ...cells, ])
        test.selectCell(i)
        if (isForked(test.cells, gamepiece)) return i
    }
    return undefined
}

const shuffleArr = function (arr) {
    // console.log(`shuffleArr`)
    // shuffles an array in random order
    // adapted to JS from Fisher-Yates shuffle algorithm
    var currentIndex = arr.length
    var temporaryValue
    var randomIndex
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        // And swap it with the current element.
        temporaryValue = arr[currentIndex]
        arr[currentIndex] = arr[randomIndex]
        arr[randomIndex] = temporaryValue
    }
    return arr
}

var selectCorner = function (cells, opponentGamepiece) {
    // console.log(`selectCorner`)
    // checks if there is an opposite corner available
    if (cells[0] === opponentGamepiece && cells[8] === ``) return 8
    if (cells[8] === opponentGamepiece && cells[0] === ``) return 0
    if (cells[2] === opponentGamepiece && cells[6] === ``) return 6
    if (cells[6] === opponentGamepiece && cells[2] === ``) return 2
    // check for empty corner, return random empty corner
    var corners = shuffleArr([ 0, 2, 6, 8, ])
    for (var i = 0; i < 4; i++) {
        if (!cells[corners[i]]) return corners[i]
    }
    return undefined
}

var selectSide = function (cells) {
    // console.log(`selectSide`)
    // selects a random open side
    var sides = shuffleArr([ 1, 5, 7, 3, ])
    for (var i = 0; i < 4; i++) {
        if (!cells[sides[i]]) return sides[i]
    }
    return undefined
}

const print = function (cells) {
    // arranges cells in a grid for logging to console
    const str = cells.map(cell => (cell || ` `)).join(`|`)
    console.log(`|` + str.slice(0, 6))
    console.log(`|` + str.slice(6, 12))
    console.log(`|` + str.slice(12, 17) + `|`)
}

let chooseCell = function (cells, gamepiece, difficulty) {
    console.log(`============`)
    console.log(`chooseCell piece= ${gamepiece}`)
    print(cells)
    console.log(`============`)
    const opponentGamepiece = gamepiece === `x` ? `o` : `x`

    // Set difficulty levels (percentage of the time to do action, index 0 easy, 2 hard)
    const rand1to100 = () => Math.floor(Math.random() * 100) + 1
    // set booleans whether to do actions, based on times in 100 to do the action
    const checkToBlockWin = [ 75, 90, 99, ][ difficulty ] > rand1to100()
    const checkToFork = [ 75, 90, 97, ][ difficulty ] > rand1to100()
    const checkToBlockFork = [ 75, 90, 95, ][ difficulty ] > rand1to100()

    // 1) if first move select a random corner or center space
    if (!countOpenCells(cells)) {
        console.log(`1.) first move`)
        return [ 0, 2, 4, 6, 8, ][Math.floor(Math.random() * 5)]
    }

    // 2) check if winnable, if so return space to win; concat board squares to avoid mutation
    const winnable = isWinnable(cells, gamepiece)
    if (winnable !== undefined) return winnable
    console.log(`2.)`)

    // 3) check if block needed
    if (checkToBlockWin) {
        const blockable = isWinnable(cells, opponentGamepiece)
        if (blockable !== undefined) return blockable
        console.log(`3.)`)
    } else {
        console.log(`ignore checking for block win step`)
    }

    // 4) check for fork opportunity
    if (checkToFork) {
        const forkable = isForkable(cells, gamepiece)
        if (forkable !== undefined) return forkable
        console.log(`4.)`)
    } else {
        console.log(`ignore checking for fork step`)
    }

    // 5) check for fork block
    if (checkToBlockFork) {
        const forkBlockable = isForkable(cells, opponentGamepiece)
        if (forkBlockable !== undefined) return forkBlockable
        console.log(`5.)`)
    } else {
        console.log(`ignore checking for block fork step`)
    }

    // 6) check for center
    if (cells[4] === ``) return 4
    console.log(`6.)`)

    // 7) check for opposite corner to opponent or empty corner
    const selectCornerResult = selectCorner(cells, opponentGamepiece)
    if (selectCornerResult !== undefined) return selectCornerResult
    console.log(`7.)`)

    // 8) check for empty side
    const selectSideResult = selectSide(cells)
    if (selectSideResult !== undefined) return selectSideResult
    console.log(`8.)`)
}

// ['', '', '', '', '', '', '', '', '' ]

module.exports = { chooseCell, }
