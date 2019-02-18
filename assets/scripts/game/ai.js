const Gameboard = require(`./gameboard`);

// helper functions

var countOpenCells = function(cells) {
    return cells.filter(cell => cell).length;
};

var isWinnable = function(cells, gamepiece) {
    // loop through each space checking if it would win the game
    for (var i = 0; i < 9; i++) {
        let testSpace = new Gameboard(gamepiece, [...cells]);
        testSpace.selectCell(i);
        if (testSpace.checkForWinner()) return i;
    }
    return undefined;
};

var rotateClockwise = function(cells) {
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
    );
};

var isForked = function(cells, gamepiece) {
    // check if game is forked by gamepiece, assumes game is not already won/winnable

    let testCells = [...cells];

    for (var i = 0; i < 4; i++) {
        // loop through 4 sides of the gameboard, rotating it clockwise on each iteration

        if (
            gamepiece === testCells[0] &&
            gamepiece === testCells[2] &&
            gamepiece === testCells[4]
        ) {
            //if first style of fork is set up, check if there are two open slots to win
            if ([testCells[1], testCells[6], testCells[8]].join().length < 4)
                return true;
        }

        if (
            gamepiece === testCells[0] &&
            gamepiece === testCells[2] &&
            gamepiece === testCells[8]
        ) {
            //if second style of fork is set up, check if there are two open slots to win
            if ([testCells[1], testCells[4], testCells[5]].join().length < 4)
                return true;
        }

        // rotate test cells
        testCells = rotateClockwise(testCells);
    }

    return false;
};

var print = function(cells) {
    // arranges cells in a grid for logging to console
    const str = cells.map(cell => (cell ? cell : " ")).join("|");
    console.log("|" + str.slice(0, 6));
    console.log("|" + str.slice(6, 12));
    console.log("|" + str.slice(12, 17) + "|");
};

var cells = ["x", "o", "x", "x", "", "", "", "", ""];

var chooseCell = function(cells, gamepiece) {
    const opponentGamepiece = gamepiece === "x" ? "o" : "x";

    //1) if first move select a random corner or center space
    if (countOpenCells(cells)) {
        return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
    }

    //2) check if winnable, if so return space to win; concat board squares to avoid mutation
    const winnable = isWinnable(cells, gamepiece);
    if (winnable !== undefined) return winnable;

    //3) check if block needed
    const blockable = isWinnable(cells, opponentGamepiece);
    if (blockable !== undefined) return blockable;

    //4) check for fork opportunity

    //5) check for fork block

    //6) check for center
    if (cells[4] === "") return 4;

    //7) check for opposite corner or empty corner

    //8) check for empty side
};
