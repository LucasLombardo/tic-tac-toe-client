
const store = require(`../store`)
const messages = require(`../messages`)
const shuffleArr = require(`../../../lib/shuffleArr`)

const signUpSuccess = () => {
    // select random signUpSuccess message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.signUpSuccess)[0])
    $(`form`).trigger(`reset`)
}

const signUpFailure = () => {
    // select random signUpFailure message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.signUpFailure)[0])
    $(`form`).trigger(`reset`)
}

const signInSuccess = responseData => {
    // select random signInSuccess message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.signInSuccess)[0])
    $(`form`).trigger(`reset`)
    // write user data to the store
    store.user = responseData.user
    // toggle which forms to display
    $(`#sign-in-form`).hide()
    $(`#sign-up-form`).hide()
    $(`#change-password-form`).show()
    $(`#sign-out-form`).show()
    // switch sidenav button text and show signout button
    $(`#open-auth`).text(`Change Password`)
    $(`#sign-out-link`).show()
    // add username to sidenav display and add user rank
    $(`#username`).text(`${store.user.email}`)
    $(`#user-rank`).text(`Pledge`)
}

const signInFailure = () => {
    // select random signInFailure message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.signInFailure)[0])
    $(`form`).trigger(`reset`)
}

const changePasswordSuccess = () => {
    // select random changePasswordSuccess message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.changePwSuccess)[0])
    $(`form`).trigger(`reset`)
}

const changePasswordFailure = () => {
    // select random changePasswordFailure message to display and clear forms
    $(`#auth-message`).text(shuffleArr(messages.changePwFailure)[0])
    $(`form`).trigger(`reset`)
}

const signOutSuccess = () => {
    // display message and reset forms
    $(`#auth-message`).text(shuffleArr(messages.signOutSuccess)[0])
    $(`form`).trigger(`reset`)
    // clear user data
    store.user.token = ``
    // toggle which forms to display
    $(`#change-password-form`).hide()
    $(`#sign-out-form`).hide()
    $(`#sign-in-form`).show()
    $(`#sign-up-form`).show()
    // switch sidenav button text and hide signout button
    $(`#open-auth`).text(`Sign In / Sign Up`)
    $(`#sign-out-link`).hide()
    // clear username in sidenav display and change rank to not logged in
    $(`#username`).text(``)
    $(`#user-rank`).text(`Not Logged In`)
}

const signOutFailure = () => {
    // display random signOutFailure message
    $(`#auth-message`).text(shuffleArr(messages.signOutFailure)[0])
}

const init = () => {
    // hide irrellevant forms
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
