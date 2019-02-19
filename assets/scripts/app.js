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

    $(`.sidenav`).sidenav()

    // hide pages
    $(`#auth-page`).hide()
    $(`#history-page`).hide()

    // to auth
    $(`#open-auth`).on(`click`, () => {
        $(`#game-page`).fadeOut(`fast`, () => {
            $(`#auth-page`).fadeIn(`slow`)
            $(`.sidenav`).sidenav(`close`)
        })
    })

    // back from auth
    $(`#back-from-auth`).on(`click`, () => {
        $(`#auth-page`).fadeOut(`fast`, () => {
            $(`#game-page`).fadeIn(`slow`)
        })
    })

    // to history
    $(`#open-history`).on(`click`, () => {
        if (gameEvents.onGetGameHistory()) {
            // if user signed in, go to history page
            $(`#auth-page`).fadeOut(`fast`)
            $(`#game-page`).fadeOut(`fast`, () => {
                $(`#history-page`).fadeIn(`slow`)
                $(`.sidenav`).sidenav(`close`)
            })
        } else {
            console.log(`hi`)
            // move user to auth page
            // to auth
            $(`#game-page`).fadeOut(`fast`, () => {
                $(`#auth-page`).fadeIn(`slow`)
                $(`.sidenav`).sidenav(`close`)
            })
        }
    })

    // back from history
    $(`#back-from-history`).on(`click`, () => {
        $(`#history-page`).fadeOut(`fast`, () => {
            $(`#game-page`).fadeIn(`slow`)
        })
    })

    // sign out button on nav
    $(`#sign-out-link`).on(`click`, authEvents.onSignOut)
})
