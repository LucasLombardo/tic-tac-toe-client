const getFormFields = require(`../../../lib/get-form-fields`)
const ui = require(`./ui`)
const api = require(`./api`)

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
        .then(ui.signInSuccess)
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
