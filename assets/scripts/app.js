'use strict'

const authEvents = require(`./auth/events`)
const gameEvents = require(`./game/events`)

$(() => {
    $(`#sign-up-form`).on(`submit`, authEvents.onSignUp)
    $(`#sign-in-form`).on(`submit`, authEvents.onSignIn)
    $(`#change-password-form`).on(`submit`, authEvents.onChangePassword)
    $(`#sign-out-form`).on(`submit`, authEvents.onSignOut)
    $(`.gameboard--marker`).on(`click`, gameEvents.onSelectSpace)
    $(`#reset`).on(`click`, gameEvents.onReset)
})
