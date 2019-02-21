'use strict'

// App Settings

// TODO: pull more settings into this file
const appSettings = {
    aiDelay: 1800, // time for ai to take turn in ms
}

// API Settings
let apiUrl
const apiUrls = {
    production: `https://tic-tac-toe-wdi-production.herokuapp.com/`,
    development: `https://tic-tac-toe-wdi.herokuapp.com/`,
}

// check if environment is local or deployed
if (window.location.hostname === `localhost`) {
    apiUrl = apiUrls.development
} else {
    apiUrl = apiUrls.production
}

module.exports = {
    apiUrl,
    appSettings,
}
