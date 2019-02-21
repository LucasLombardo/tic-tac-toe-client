# Tic Tac Bro

Tic Tac Bro is a simple single page web application for playing tic tac toe either versus another player locally or versus the Tic Tac Bro, a frat bro inspired AI with three difficulty levels.

## Technology Used

Tic Tac Bro was built using jQuery, JavaScript, Materialize.css, Vivus.js, Scss, and HTML.

### Planning Process

The planning process started out with a concept and a wireframe. I built the first wireframe using Figma, a cloud design tool. I thought it would make a cool progressive web app so I wanted to take a mobile first approach. The design was heavily influenced by material design apps like Gmail and Slack for Android, mainly because I'm an Android user and have always been a fan of that style of design. 

![wireframe_draft1](https://imagizer.imageshack.com/img923/7478/bfQeTn.jpg)

My user stories were:
-   As a user, I want to be able to sign in, sign up, and sign out of my account and be able to change my password.
-   As a user, I want to be able to play tic tac toe against another player in person.
-   As a user, I want to be able to play games versus an AI at various difficulty levels.
-   As a user, I want to be able to view my game history.
-   s a user, I want to be able to reset my current game and game history.
-   As a user, I want to be able tic tac toe and have access to all features aside from game history while not logged in.
-   As a user, I want to be able to play the game and access all features on mobile, any common screen size, and any common modern browser (firefox, edge, safari, opera, chrome).

I planned the project to have 3 main version launches.
1.  (v0.1.0) Minimum Viable Product, all the core functionality required by the project guidelines without much styling work.
2.  (v0.2.0)Core styling and AI functionality, the meat of what I wanted to do with the app.
3.  (v.1.0.0) Polished version with PWA features, loading speed optimization, etc. This version will be thoroughly tested on all major browsers.

Currently the app has just finished the second major version release, v0.2.0

Most of my day to day project planning has been done using Trello, where my strategy is adding every todo item I can think of to one of two lists, "core functionality" and "nice to haves". I prioritized core functionality and only did nice to have things if I felt like I had extra time or needed a break from core functionality work.

### Future versions / Unsolved problems

This app is still a work in progress. Before the v1.0.0 release I would like to finish:
-   Progressive Web App Functionality
-   Writing tokens to local storage
-   Information page with instructions / faq
-   Custom preloader with a spinning tic tac toe grid
-   Improved desktop styling

Currently unsolved but identified problems include
-   Handling invalidated tokens if a user signs in from a different device and while still logged in on the first device.


