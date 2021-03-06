const Gameboard = function (turn, cells, user) {
    this.cells = cells || [ ``, ``, ``, ``, ``, ``, ``, ``, ``, ] // array of 9 strings
    this.turn = turn || `x` // enum: `x` or `o`
    this.starts = `x`
    this.winner = null // enum: null, `x`, `o`, or `tie`
    this.user = user || `x` // enum: `x` or `o`
}

Gameboard.prototype = {

    selectCell: function (cellIndex) {
        // if cell unavailable, returns false
        if (this.cells[cellIndex] || this.winner) {
            return false
        } else {
            // if cell avaialable, selects it and returns true
            this.cells[cellIndex] = this.turn
            // change turn
            this.turn = this.turn === `x` ? `o` : `x`
            // check for winner
            this.checkForWinner()
            return true
        }
    },

    checkForWinner: function () {
        // set winning index combinations
        const winningCombinations = [ `048`, `264`, `036`, `147`, `258`, `012`, `345`, `678`, ]
        // check for each winning combination
        for (let i = 0; i < winningCombinations.length; i++) {
            const comb = winningCombinations[i]
            // if combination index 0 and 1 match and arent falsey set isWin to true
            let isWin = this.cells[comb[0]] && this.cells[comb[0]] === this.cells[comb[1]]
            // if combination index 1 and 2 also match keep isWin as true
            isWin = isWin && this.cells[comb[1]] === this.cells[comb[2]]
            // if is win set winner and return true
            if (isWin) {
                this.winner = this.cells[comb[0]]
                return true
            }
        }
        // if tie, set winner to tie and return true
        const emptyCells = this.cells.filter(cell => !cell)
        if (!emptyCells.length) {
            // if length 0, all cells are filled and it is a tie
            this.winner = `tie`
            return true
        }
        // if no win found return false
        return false
    },

    reset: function (turn) {
        // resets gameboard
        this.cells = [ ``, ``, ``, ``, ``, ``, ``, ``, ``, ]
        this.starts = this.starts === `x` ? `o` : `x`
        this.turn = turn || this.starts
        this.winner = null
    },
}

module.exports = Gameboard
