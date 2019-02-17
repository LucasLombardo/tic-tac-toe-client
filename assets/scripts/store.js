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
}

module.exports = store
