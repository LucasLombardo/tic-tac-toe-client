
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
    $(`#auth-message`).text(`Successfully signed out.`)
    $(`form`).trigger(`reset`)
    store.user.token = ``
}

const signOutFailure = e => {
    $(`#auth-message`).text(`Failed to sign out`)
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
}
