const shuffleArr = function (arr) {
    // shuffles an array in random order
    // adapted to JS from Fisher-Yates shuffle algorithm
    let currentIndex = arr.length
    let temporaryValue
    let randomIndex
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

module.exports = shuffleArr
