'use strict';

const SlackBot = require('slackbots'),
      furby = require('./lib/furby');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

// create a bot
var bot = new SlackBot({
  token: process.env.token,
  name: 'refurb'
});

bot.on('start', function() {
  checkForNewResults();
});

setInterval(function() {
  checkForNewResults();
}, 60*1000); // Once per minute

const furbySettings = {
  url: 'http://www.apple.com/ie/shop/browse/home/specialdeals/mac',
  keywords: [
    'mac'
  ]
};

function checkForNewResults() {
  furby.checkPage(furbySettings.url)
    .then(furby.newResults)
    .then(function(results) {
      furby.postNewResultsToChannel(bot, results);
      furby.postMatchedResultsToUser(bot, results, 'donovanh', furbySettings.keywords);
    });
}
