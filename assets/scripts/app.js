'use strict'

const authEvents = require(`./auth/events`)
const gameEvents = require(`./game/events`)
const store = require(`./store`)

$(() => {
    // display html once loaded to avoid FOUC
    $(`html`).removeClass(`unloaded`)
    // run initialization functions
    authEvents.onLoad()
    $(`.sidenav`).sidenav() // material.css init

    // add auth event handlers
    $(`#sign-up-form`).on(`submit`, authEvents.onSignUp)
    $(`#sign-in-form`).on(`submit`, authEvents.onSignIn)
    $(`#change-password-form`).on(`submit`, authEvents.onChangePassword)
    $(`#sign-out-form`).on(`submit`, authEvents.onSignOut)
    $(`#sign-out-link`).on(`click`, authEvents.onSignOut)

    // add click handlers to gameboard markers
    $(`.gameboard--marker`).on(`click`, function (e) {
        // only trigger click on gameboard marker, ignore descendents
        if (e.target !== this) return
        gameEvents.onSelectSpace(e)
    })
    $(`#reset`).on(`click`, gameEvents.onReset)

    // AI SETTINGS LOGIC

    // add click listener for ai toggle
    $(`#play-vs-ai`).on(`click`, () => {
        // toggle ai in store
        store.settings.isVsAi = !store.settings.isVsAi
        // manually set checkbox to current value (boolean)
        $(`#ai-checkbox`).prop(`checked`, store.settings.isVsAi)
        // reset gameboard
        gameEvents.onReset()
        // return false to avoid jQuery running this twice per click
        return false
    })

    // handle ai difficulty switches
    $(`#difficulty-0`).on(`click`, () => {
        store.settings.difficulty = 0
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-0-radio`).attr(`checked`, `checked`)
        return false
    })

    $(`#difficulty-1`).on(`click`, () => {
        store.settings.difficulty = 1
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-1-radio`).attr(`checked`, `checked`)
        return false
    })

    $(`#difficulty-2`).on(`click`, () => {
        store.settings.difficulty = 2
        $(`input[name='difficulty-group']`).attr(`checked`, false)
        $(`#difficulty-2-radio`).attr(`checked`, `checked`)
        return false
    })

    // PAGE ROUTING LOGIC

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
        // reset gameboard
        gameEvents.onReset()
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
        // reset board
        gameEvents.onReset()
        $(`#history-page`).fadeOut(`fast`, () => {
            $(`#game-page`).fadeIn(`slow`)
        })
    })
})
