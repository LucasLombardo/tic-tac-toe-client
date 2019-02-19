
const store = require(`../store`)

const signUpSuccess = () => {
    $(`#auth-message`).text(`Successfully signed up`)
    $(`form`).trigger(`reset`)
}

const signUpFailure = e => {
    $(`#auth-message`).text(`Error: ${e.responseText}`)
    $(`form`).trigger(`reset`)
}

const signInSuccess = responseData => {
    $(`#auth-message`).text(`Successfully signed in`)
    $(`form`).trigger(`reset`)
    store.user = responseData.user
    $(`#sign-in-form`).hide()
    $(`#sign-up-form`).hide()
    $(`#change-password-form`).show()
    $(`#sign-out-form`).show()
    $(`#open-auth`).text(`Change Password`)
    $(`#sign-out-link`).show()
}

const signInFailure = e => {
    $(`#auth-message`).text(`Error: ${e.statusText}`)
    $(`form`).trigger(`reset`)
}

const changePasswordSuccess = e => {
    $(`#auth-message`).text(`successfully changed pw`)
    $(`form`).trigger(`reset`)
}

const changePasswordFailure = e => {
    $(`#auth-message`).text(`Failed to change pw`)
    $(`form`).trigger(`reset`)
}

const signOutSuccess = e => {
    // display message and reset forms
    $(`#auth-message`).text(`Successfully signed out.`)
    $(`form`).trigger(`reset`)
    // clear user token
    store.user.token = ``
    // hide unrelevant forms / show relevant ones
    $(`#change-password-form`).hide()
    $(`#sign-out-form`).hide()
    $(`#sign-in-form`).show()
    $(`#sign-up-form`).show()
    $(`#open-auth`).text(`Sign In / Sign Up`)
    $(`#sign-out-link`).hide()
}

const signOutFailure = e => {
    $(`#auth-message`).text(`Failed to sign out`)
}

const init = () => {
    $(`#change-password-form`).hide()
    $(`#sign-out-form`).hide()
    $(`#sign-out-link`).hide()
}

module.exports = {
    signUpSuccess,
    signUpFailure,
    signInSuccess,
    signInFailure,
    changePasswordSuccess,
    changePasswordFailure,
    signOutFailure,
    signOutSuccess,
    init,
}
