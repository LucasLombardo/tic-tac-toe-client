// TODO: needs tree shaking, not all messages are used in app
// attributes of messages object should be in format of array with at least one value
const messages = {
    // Auth Related
    signInSuccess: [
        `You're in bro, now lets play a game.`,
        `You're signed in, Chief.`,
    ],
    signInFailure: [
        `Something's not checking out with your login information guy.`,
        `You're gonna need the right login info if you wanna rage, bro.`,
    ],
    signUpSuccess: [
        `You're all signed up pledge, sign in so we can get a game going.`,
        `You're good dude, just sign in so we can start`,
    ],
    signUpFailure: [
        `You can't sign up with that info, chief.`,
        `Someones already got that nickname here bro`,
    ],
    changePwSuccess: [
        `You changed the secret password. Don't forget it next time you try to get in the house.`,
    ],
    changePwFailure: [
        `Couldn't change your password. Make sure you type in your previous password first bro.`,
    ],
    signOutSuccess: [
        `YOU'RE OUT BRO, just leave.`,
    ],
    signOutFailure: [
        `You couldn't be logged out dog, once a brother always a brother.`,
    ],
    // Game related
    xsTurn: [
        `It's X's turn. Make a move.`,
        `It's X's turn. Let's see what they pick.`,
    ],
    osTurn: [
        `It's O's turn. Make a move.`,
        `It's O's turn. Come on O.`,
    ],
    brosTurn: [
        `My turn, let me think here.`,
        `Hold on while I select the perfect move...`,
        `Give me a chance to make my move.`,
        `My turn.`,
        `Let me see here. Which spot should I pick?`,
    ],
    usersTurn: [
        `You're up, chief. Make it count.`,
        `Your turn nerd.`,
        `Will you make a move already, I don't have all day.`,
        `Take your turn, bro.`,
        `We're all waiting for you to take your turn...`,
    ],
    oWins: [
        `"O"mg bro. O just totally won.`,
        `O won the game, O isn't lame.`,
    ],
    xWins: [
        `X marks the spot where the game was won.`,
        `X is the champion, my friend, dunn dun dunn.`,
    ],
    tie: [
        `Nobody wins, nobody loses. Play again.`,
        `No more spaces, looks like it's a tie.`,
        `Tie game. How boring...`,
    ],
    broWins: [
        `Hah. I won, get wrecked loser.`,
        `Hell yeah in your face. I won.`,
        `Did you really think you stood a chance against me? I won.`,
        `The champion reigns supreme. I won.`,
    ],
    userWins: [
        `You win this time punk. Let's play again.`,
        `What the hell. Who plays like that? You win this time guy.`,
        `Miracles do happen. You won.`,
        `The sun was in my eyes. Enjoy the win while you can.`,
    ],
    gameOver: [
        `Game over, nerd.`,
        `Game over.`,
        `The game's over bud.`,
    ],
    invalidMove: [
        `Woah, I can't let you place a marker there chief.`,
        `That spots not gonna work man.`,
        `You can't place a marker there.`,
    ],
}

module.exports = messages
