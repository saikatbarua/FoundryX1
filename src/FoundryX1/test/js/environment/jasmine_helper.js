﻿var jsdom = require("jsdom");

//http://nfriedly.com/techblog/2013/02/automatically-unit-testing-client-side-javascript-with-jasmine-and-node-js/

window = jsdom.jsdom('<html><head></head><body><div id="rondavu_container"></div></body></html>').createWindow();

if (Object.keys(window).length === 0) {
    // this hapens if contextify, one of jsdom's dependencies doesn't install correctly
    // (it installs different code depending on the OS, so it cannot get checked in.);
    throw "jsdom failed to create a usable environment, try uninstalling and reinstalling it";
}

global.window = window;

global.document = window.document;

var R = global.R = require('../../build/rondavu_test_mode.js');
