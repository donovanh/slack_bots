'use strict';

const SlackBot = require('slackbots'),
      checkPage = require('./lib/checkPage'),
      jsonfile = require('jsonfile');

const refurbSettings = {
  url: 'http://www.apple.com/ie/shop/browse/home/specialdeals/mac',
  keywords: [
    'macbook pro',
    '2014'
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

// TODO: put these into a better named Refurb Scraping library

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
        if (isMatch(result.matchText, refurbSettings.keywords)) {
          // If it does, send a private message
          bot.postMessageToUser('donovanh', message, params);
        }
      }
    });
    if (data.ids.length !== numberOfItems) {
      // Write back the resulting file
      jsonfile.writeFile(storageFile, data, function (err) {
        if (err) console.error(err);
      });
    } else {
      //console.log('No new items found');
    }
  });
}

function buildRegex(keywords) {
  // ^(?=.*\bmeat\b)(?=.*\bpasta\b)(?=.*\bdinner\b).+
  let regex = '';
  keywords.forEach(function(keyword) {
    regex += '(?=.*'+ keyword +')'
  });
  regex += '.+';
  return regex;
}

function isMatch(matchText, keywords) {
  // Return true if this matches keywords
  let regex = buildRegex(keywords);
  return matchText.search(regex) > -1 ? true : false;
}

function checkForNewResults() {
  checkPage(refurbSettings.url)
    .then(function(results) {
      showResults(results);
    });
}

setInterval(function() {
  checkForNewResults();
}, 60*1000); // Once per minute

bot.on('start', function() {
  checkForNewResults();
});
