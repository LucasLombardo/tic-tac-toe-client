const updateCell = (space, currTurn) => {
    console.log(`updateCell space:${space} turn:${currTurn}`)
    console.log($(`.gameboard--space:nth-of-type(${space})`))
    $(`.gameboard--space:nth-of-type(${Number(space) + 1})`).text(currTurn)
}

module.exports = { updateCell, }
