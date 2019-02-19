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
        difficulty: 0, // enum: 0, 1, or 2 with 2 being hardest
    },

}

module.exports = store
