const getFormFields = require(`../../../lib/get-form-fields`)
const ui = require(`./ui`)
const api = require(`./api`)
const game = require(`../game/game`)
const gameUi = require(`../game/ui`)

const onSignUp = event => {
    event.preventDefault()
    // get form data and create POST object for API
    const form = event.target
    const formData = getFormFields(form)

    // override pw verification behavior of api, no one cares that much about these accts
    formData.credentials.password_confirmation = formData.credentials.password

    // call sign up AJAX call, then pass result of promise data to ui functions
    api.signUp(formData)
        .then(ui.signUpSuccess)
        .catch(ui.signUpFailure)
}

const onSignIn = event => {
    event.preventDefault()
    // get form data and create POST object for API
    const form = event.target
    const formData = getFormFields(form)

    // call sign in AJAX call, then pass result of promise data to ui functions
    api.signIn(formData)
        .then((responseData) => {
            ui.signInSuccess(responseData)
            // reset the gameboard
            game.reset()
        })
        .catch(ui.signInFailure)
}

const onChangePassword = event => {
    event.preventDefault()

    // get form data and create PATCH object for API
    const form = event.target
    const formData = getFormFields(form)

    // call PATCH request and pass payload to ui functions
    api.changePassword(formData)
        .then(ui.changePasswordSuccess)
        .catch(ui.changePasswordFailure)
}

const onSignOut = event => {
    event.preventDefault()

    // call signout AJAX request, uses user token in store, no data body
    api.signOut()
        .then(ui.signOutSuccess)
        .catch(ui.signOutFailure)

    // clear game history
    gameUi.clearGameHistory()
}

const onLoad = () => {
    // initialize ui once page is loaded
    ui.init()
}

module.exports = {
    onSignUp,
    onSignIn,
    onChangePassword,
    onSignOut,
    onLoad,
}
