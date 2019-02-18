'use strict'

const authEvents = require(`./auth/events`)
const gameEvents = require(`./game/events`)

$(() => {
    authEvents.onLoad()
    $(`#sign-up-form`).on(`submit`, authEvents.onSignUp)
    $(`#sign-in-form`).on(`submit`, authEvents.onSignIn)
    $(`#change-password-form`).on(`submit`, authEvents.onChangePassword)
    $(`#sign-out-form`).on(`submit`, authEvents.onSignOut)
    $(`.gameboard--marker`).on(`click`, gameEvents.onSelectSpace)
    $(`#reset`).on(`click`, gameEvents.onReset)
    $(`#get-game-history`).on(`click`, gameEvents.onGetGameHistory)

    $(`.sidenav`).sidenav()

    // hide pages
    $(`#auth-page`).hide()
    $(`#history-page`).hide()
    // temporary page change logic
    let page = `#game-page`
    $(`.nm-logo`).on(`click`, () => {
        if (page === `#game-page`) {
            page = `#auth-page`
            $(`#game-page`).fadeOut(`fast`, () => {
                $(`#auth-page`).fadeIn(`slow`)
            })
        } else {
            page = `#game-page`
            $(`#auth-page`).fadeOut(`fast`, () => {
                $(`#game-page`).fadeIn(`slow`)
            })
        }
    })
})
