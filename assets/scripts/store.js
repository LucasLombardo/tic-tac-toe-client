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
        selectSpace: false,
    },
    settings: {
        isVsAi: true,
        difficulty: 1, // enum: 0, 1, or 2 with 2 being hardest
    },

}

module.exports = store
