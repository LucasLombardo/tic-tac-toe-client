const { apiUrl, } = require(`../config`)
const store = require(`../store`)

const createGame = () => {
    const { token, } = store.user
    if (token) {
        return $.ajax({
            url: `${apiUrl}/games`,
            method: `POST`,
            headers: {
                Authorization: `Token token=${token}`,
            },
        })
    }
}

const updateGame = patchObj => {
    const { user: { token, }, gameId, } = store
    if (token) {
        console.log(gameId)
        return $.ajax({
            url: `${apiUrl}games/${gameId}`,
            method: `PATCH`,
            headers: {
                Authorization: `Token token=${token}`,
            },
            data: patchObj,
        })
    }
}

const getFinishedGames = () => {
    const { token, } = store.user
    if (token) {
        return $.ajax({
            url: `${apiUrl}games?over=true`,
            method: `GET`,
            headers: {
                Authorization: `Token token=${token}`,
            },
        })
    }
}

module.exports = {
    createGame,
    updateGame,
    getFinishedGames,
}
