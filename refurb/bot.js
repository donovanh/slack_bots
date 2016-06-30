'use strict';

const SlackBot = require('slackbots'),
      checkPage = require('./lib/checkPage'),
      jsonfile = require('jsonfile');

const refurbSettings = {
  url: 'http://www.apple.com/ie/shop/browse/home/specialdeals/mac',
  keywords: [
  'mac'
  ]
};

const storageFile = './datastore/data.json',
      params = {
        icon_emoji: ':robot_face:'
      };

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

// create a bot
var bot = new SlackBot({
  token: process.env.token, // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'refurb'
});

function showResults(results) {
  jsonfile.readFile(storageFile, function(err, data) {
    let numberOfItems = data.ids.length;
    results.forEach(function(result) {
      if (data.ids.indexOf(result.id) === -1) {
        // Insert this item to the results
        data.ids.push(result.id);
        // Broadcast this item (it's new)
        let message = result.title + ' ' + result.link;
        bot.postMessageToChannel('refurbs', message, params);
        // Check if it matches this user's refurb keywords
        // If it does, send a private message
        // Hey maybe send a tweet too :/
      }
    });
    if (data.ids.length !== numberOfItems) {
      // Write back the resulting file
      jsonfile.writeFile(storageFile, data, function (err) {
        console.error(err);
      });
    } else {
      console.log('No new items found');
    }
  });
}

function checkForNewResults() {
  checkPage(refurbSettings)
    .then(function(results) {
      showResults(results);
    });
}

setInterval(function() {
  checkForNewResults();
}, 60*1000); // Once per minute

bot.on('start', function() {
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  // define channel, where bot exist. You can adjust it there https://my.slack.com/services
  //bot.postMessageToChannel('general', 'meow!', params);

  // define existing username instead of 'user_name'
  bot.postMessageToUser('donovanh', 'I am alive!', params);
  checkForNewResults();

  // define private group instead of 'private_group', where bot exist
  //bot.postMessageToGroup('private_group', 'meow!', params);
});
