const getFormFields = require(`../../../lib/get-form-fields`)
const ui = require(`./ui`)
const api = require(`./api`)
const game = require(`../game/game`)
const gameUi = require(`../game/ui`)

const onSignUp = event => {
    event.preventDefault()
    const form = event.target
    const formData = getFormFields(form)

    api.signUp(formData)
        .then(ui.signUpSuccess)
        .catch(ui.signUpFailure)
}

const onSignIn = event => {
    event.preventDefault()
    const form = event.target
    const formData = getFormFields(form)

    api.signIn(formData)
        .then((res) => {
            ui.signInSuccess(res)
            game.reset()
        })
        .catch(ui.signInFailure)
}

const onChangePassword = event => {
    event.preventDefault()
    const form = event.target
    const formData = getFormFields(form)

    api.changePassword(formData)
        .then(ui.changePasswordSuccess)
        .catch(ui.changePasswordFailure)
}

const onSignOut = event => {
    event.preventDefault()
    api.signOut()
        .then(ui.signOutSuccess)
        .catch(ui.signOutFailure)

    gameUi.clearGameHistory()
}

const onLoad = () => {
    ui.init()
}

module.exports = {
    onSignUp,
    onSignIn,
    onChangePassword,
    onSignOut,
    onLoad,
}
