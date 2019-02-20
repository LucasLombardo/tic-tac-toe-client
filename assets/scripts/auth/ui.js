
const store = require(`../store`)
const messages = require(`../messages`)
const shuffleArr = require(`../../../lib/shuffleArr`)

const signUpSuccess = () => {
    $(`#auth-message`).text(shuffleArr(messages.signUpSuccess)[0])
    $(`form`).trigger(`reset`)
}

const signUpFailure = e => {
    $(`#auth-message`).text(shuffleArr(messages.signUpFailure)[0])
    $(`form`).trigger(`reset`)
}

const signInSuccess = responseData => {
    $(`#auth-message`).text(shuffleArr(messages.signInSuccess)[0])
    $(`form`).trigger(`reset`)
    store.user = responseData.user
    $(`#sign-in-form`).hide()
    $(`#sign-up-form`).hide()
    $(`#change-password-form`).show()
    $(`#sign-out-form`).show()
    $(`#open-auth`).text(`Change Password`)
    $(`#sign-out-link`).show()
    $(`#username`).text(`${store.user.email}`)
    $(`#user-rank`).text(`Pledge`)
}

const signInFailure = e => {
    $(`#auth-message`).text(shuffleArr(messages.signInFailure)[0])
    $(`form`).trigger(`reset`)
}

const changePasswordSuccess = e => {
    $(`#auth-message`).text(shuffleArr(messages.changePwSuccess)[0])
    $(`form`).trigger(`reset`)
}

const changePasswordFailure = e => {
    $(`#auth-message`).text(shuffleArr(messages.changePwFailure)[0])
    $(`form`).trigger(`reset`)
}

const signOutSuccess = e => {
    // display message and reset forms
    $(`#auth-message`).text(shuffleArr(messages.signOutSuccess)[0])
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
    $(`#username`).text(``)
    $(`#user-rank`).text(`Not Logged In`)
}

const signOutFailure = e => {
    $(`#auth-message`).text(shuffleArr(messages.signOutFailure)[0])
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
