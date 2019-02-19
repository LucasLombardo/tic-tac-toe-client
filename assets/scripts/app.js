'use strict'

const authEvents = require(`./auth/events`)
const gameEvents = require(`./game/events`)
const store = require(`./store`)

$(() => {
    $(`html`).removeClass(`unloaded`)
    authEvents.onLoad()
    $(`#sign-up-form`).on(`submit`, authEvents.onSignUp)
    $(`#sign-in-form`).on(`submit`, authEvents.onSignIn)
    $(`#change-password-form`).on(`submit`, authEvents.onChangePassword)
    $(`#sign-out-form`).on(`submit`, authEvents.onSignOut)
    $(`.gameboard--marker`).on(`click`, gameEvents.onSelectSpace)
    $(`#reset`).on(`click`, gameEvents.onReset)

    $(`.sidenav`).sidenav()

    // ai toggle
    $(`#play-vs-ai`).on(`click`, () => {
        store.settings.isVsAi = !store.settings.isVsAi
        // manually set checkbox to current value
        $(`#ai-checkbox`).prop(`checked`, store.settings.isVsAi)
        // return false to avoid jQuery running this twice per click
        return false
    })

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

    // handle ai difficulty switches
    $(`#difficulty-0`).on(`click`, () => {
        store.settings.difficulty = 0
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-0-radio`).attr(`checked`, `checked`)
        console.log(store.settings)
        return false
    })

    $(`#difficulty-1`).on(`click`, () => {
        store.settings.difficulty = 1
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-1-radio`).attr(`checked`, `checked`)
        console.log(store.settings)
        return false
    })

    $(`#difficulty-2`).on(`click`, () => {
        store.settings.difficulty = 2
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-2-radio`).attr(`checked`, `checked`)
        console.log(store.settings)
        return false
    })
})
