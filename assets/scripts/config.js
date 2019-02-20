'use strict'

// APP Settings

const appSettings = {
    aiDelay: 700, // time for ai to take turn in ms

}

// API Base URLS
let apiUrl
const apiUrls = {
    production: `https://tic-tac-toe-wdi-production.herokuapp.com/`,
    development: `https://tic-tac-toe-wdi.herokuapp.com/`,
}

if (window.location.hostname === `localhost`) {
    apiUrl = apiUrls.development
} else {
    apiUrl = apiUrls.production
}

module.exports = {
    apiUrl,
    appSettings,
}
