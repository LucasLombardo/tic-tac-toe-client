'use strict'

const store = {
    user: {
        token: ``,
    },
    gameId: ``,
    requestlimits: {
        // if set to true, disallow another request
        reset: false,
        getGameHistory: false,
    },
    settings: {
        isVsAi: true,
        difficulty: 2, // enum: 1, 2, or 3 with 3 being hardest
    },

}

module.exports = store
