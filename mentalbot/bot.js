'use strict';

var Botkit = require('./lib/Botkit.js'),
    os = require('os');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  debug: true,
  json_file_store: './data/'
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

// Set up the responses
let responses = require('./lib/responses');
responses.attachResponses(controller);

