'use strict'

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// import materialize
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

// allows usage of new JS features
require(`babel-polyfill`)

// load manifests
// scripts
require(`./assets/scripts/app.js`)

// styles
require(`./assets/styles/index.scss`)
